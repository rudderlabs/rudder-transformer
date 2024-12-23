import { HttpClient } from "../utils/httpClient";
import { SalesforceAuth, AuthProvider, SalesforceRecord, SalesforceResponse, QueryResponse, OAuthCredentials, SalesforceDestinationConfig } from "../types/salesforceTypes";
import { TokenProvider } from "../auth/tokenProvider";
import { OAuthProvider } from "../auth/oauthProvider";

export class SalesforceClient {
    private httpClient: HttpClient;

    constructor(auth: SalesforceAuth) {
        let authProvider: AuthProvider;
        let instanceUrl: string;

        if ("accessToken" in auth) {
            authProvider = new OAuthProvider(auth as OAuthCredentials );
            instanceUrl = auth.instanceUrl;
        } else {
            authProvider = new  TokenProvider(auth as SalesforceDestinationConfig);
            instanceUrl = auth.instanceUrl;
        }

        this.httpClient = new HttpClient(instanceUrl, authProvider);
    }

    async create(objectType: string, record: SalesforceRecord, salesforceId?: string): Promise<SalesforceResponse> {
        let targetEndpoint = `/services/data/v50.0/sobjects/${objectType}`;
        if (salesforceId) {
            targetEndpoint += `/${salesforceId}?_HttpMethod=PATCH`;
        }
        return this.httpClient.post<SalesforceResponse>(targetEndpoint, record);
    }

    async search(objectType: string, identifierValue: string, identifierType: string): Promise<QueryResponse<SalesforceRecord>> {
        return this.httpClient.get<QueryResponse<SalesforceRecord>>(`/services/data/v50.0/parameterizedSearch/?q=${identifierValue}&sobject=${objectType}&in=${identifierType}&${objectType}.fields=id,${identifierType}`);
    }
}
