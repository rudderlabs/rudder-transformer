import { getLibraryCodeV1 } from '../util/customTransforrmationsStore-v1';
import { TransformationJavascriptRunner } from './codeRunner/transformationJavascriptRunner';
import { Dependencies, LibraryCodeInput, LibraryVersionInput } from './types';

export interface TestRunRequestBody {
  input: Record<string, any>[];
  code: string;
  dependencies: Dependencies;
  language: string;
  metadata: {
    transformationId: string;
    workspaceId: string;
  };
}

export const TransformationV1Service = {
  async runTransformation(transformation: TestRunRequestBody) {
    const { input, code, dependencies, metadata } = transformation;

    const librariesVersionIds = dependencies.libraries
      .filter((l) => !!(l as LibraryVersionInput).versionId)
      .map((dependency) => (dependency as LibraryVersionInput).versionId);

    const libraries = (
      await Promise.all(
        librariesVersionIds.map(async (libraryVersionId) => getLibraryCodeV1(libraryVersionId)),
      )
    ).map((library) => ({
      importName: library.name,
      code: library.code,
    }));

    const transformedDependencies = dependencies.libraries
      .filter((l) => !!(l as LibraryCodeInput).code)
      .map((dependency) => ({
        importName: (dependency as LibraryCodeInput).importName,
        code: (dependency as LibraryCodeInput).code,
      }));

    const transformationRunner = new TransformationJavascriptRunner(
      {
        code,
        dependencies: {
          libraries: [...transformedDependencies, ...libraries],
          credentials: dependencies.credentials,
        },
        testMode: true,
      },
      metadata,
    );
    try {
      await transformationRunner.init();
      const result = await transformationRunner.transform(input);
      return result;
    } finally {
      await transformationRunner.dispose();
    }
  },
};
