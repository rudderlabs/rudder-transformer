import { isNil } from 'lodash';
import { getTransformationCode } from '../util/customTransforrmationsStore';
import { getLibraryCodeV1 } from '../util/customTransforrmationsStore-v1';
import { TransformationJavascriptRunner } from './codeRunner/transformationsJSRunner';
import { CredentialInput, Dependencies, LibraryCodeInput, LibraryVersionInput } from './types';
import { runOpenFaasUserTransform } from '../util/customTransformer-faas';
import { parserForImport } from '../util/parser';

interface PythonTransDependencies {
  libraries: LibraryVersionInput[];
  credentials: CredentialInput[];
}

interface JSTransDependencies {
  libraries: LibraryCodeInput[];
  credentials: CredentialInput[];
}

interface PythonTransformationRunInput {
  workspaceId: string;
  versionId: string;
  code: string;
  imports?: string[];
  dependencies: PythonTransDependencies;
}
interface PythonTransformationTestRunInput {
  code: string;
  imports?: string[];
  dependencies: PythonTransDependencies;
}

export interface TestRunRequestBody {
  input: Record<string, any>[];
  code?: string;
  versionId?: string;
  dependencies: Dependencies;
  language: string;
  metadata: {
    transformationId: string;
    workspaceId: string;
  };
}

export class UserTransformerService {
  private async resolveLibraries(libraries: Dependencies['libraries'], imports?: string[]) {
    const librariesVersionIds = libraries
      ?.filter((l) => !!(l as LibraryVersionInput).versionId && !(l as LibraryCodeInput).code)
      .map((dependency) => (dependency as LibraryVersionInput).versionId);

    const librariesCode = libraries
      .filter((l) => !!(l as LibraryCodeInput).code)
      .map((dependency) => ({
        importName: (dependency as LibraryCodeInput).importName,
        code: (dependency as LibraryCodeInput).code,
      }));

    const libs = (
      await Promise.all(
        librariesVersionIds.map(async (libraryVersionId) => getLibraryCodeV1(libraryVersionId)),
      )
    )
      .filter((library) => imports?.includes(library.name))
      .map((library) => ({
        importName: library.name,
        code: library.code,
      }));
    return [...libs, ...librariesCode];
  }

  private async runJSTransformation(
    events: Record<string, any>[],
    transformation: {
      id?: string;
      workspaceId?: string;
      code: string;
      imports?: string[];
      language: string;
      dependencies: JSTransDependencies;
    },
    testMode: boolean = false,
  ) {
    const { code, imports, id, workspaceId, dependencies } = transformation;

    const importedLibrariesNames =
      imports || Object.keys(await parserForImport(code, false, [], 'javascript'));

    const libraries = await this.resolveLibraries(dependencies.libraries, importedLibrariesNames);

    if (!code) {
      throw new Error('No code provided');
    }

    const transformationRunner = new TransformationJavascriptRunner(
      {
        code,
        dependencies: {
          libraries,
          credentials: dependencies.credentials,
        },
        testMode,
      },
      {
        transformationId: id || '',
        workspaceId: workspaceId || '',
      },
    );
    try {
      const result = await transformationRunner.transform(events);
      return result;
    } finally {
      await transformationRunner.dispose();
    }
  }

  private async runPythonTransformation(
    events: Record<string, any>[],
    transformation: PythonTransformationTestRunInput | PythonTransformationRunInput,
    testMode?: boolean,
  ): Promise<any> {
    const { code, dependencies } = transformation;
    const librariesVersionIds = dependencies.libraries.map((l) => l.versionId);

    const updatedEvents = events.map((ev) => {
      if (isNil(ev.credentials)) {
        return {
          ...ev,
          credentials: dependencies.credentials,
        };
      }
      return ev;
    });
    return runOpenFaasUserTransform(
      updatedEvents,
      {
        code,
      },
      librariesVersionIds,
      testMode,
    );
  }

  async runTransformation(input: TestRunRequestBody, testMode: boolean = false) {
    const { input: events, code, language = 'javascript', versionId, dependencies } = input;
    const transformation = versionId ? await getTransformationCode(versionId) : { code, language };
    if (language === 'javascript') {
      return this.runJSTransformation(events, { ...transformation, dependencies }, testMode);
    }
    const resp = await this.runPythonTransformation(
      events,
      { ...transformation, dependencies },
      testMode,
    );
    return resp;
  }
}

export const transformerService = new UserTransformerService();
