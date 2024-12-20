type AuthData = {
    instanceUrl: string;
    accessToken: string;
};

type AuthFlow = 'OAUTH' | 'OTHER';

type AuthOverride = {
    accessToken: string;
    authorizationFlow: AuthFlow;
};

class SalesforceSDK {
    private authorizationData: AuthData;
    private apiVersion: string;
    private authorizationFlow: AuthFlow;

    constructor(auth: AuthData & { authorizationFlow: AuthFlow }, apiVersion: string) {
        this.authorizationData = {
            instanceUrl: auth.instanceUrl,
            accessToken: auth.accessToken,
        };
        this.apiVersion = apiVersion;
        this.authorizationFlow = auth.authorizationFlow;
    }

    public setAuth(auth: AuthData & { authorizationFlow: AuthFlow }): void {
        this.authorizationData = {
            instanceUrl: auth.instanceUrl,
            accessToken: auth.accessToken,
        };
        this.authorizationFlow = auth.authorizationFlow;
    }

    private getAuthHeader(authOverride?: AuthOverride): Record<string, string> {
        const flow = authOverride?.authorizationFlow || this.authorizationFlow;
        const token = authOverride?.accessToken || this.authorizationData.accessToken;

        return flow === 'OAUTH'
            ? { Authorization: `Bearer ${token}` }
            : { Authorization: token };
    }

    private buildHeaders(customHeaders: Record<string, string> = {}, authOverride?: AuthOverride): Record<string, string> {
        return {
            ...this.getAuthHeader(authOverride),
            'Content-Type': 'application/json',
            ...customHeaders,
        };
    }

    private async apiCall(
        url: string,
        method: 'GET' | 'POST' | 'PATCH',
        body?: any,
        customHeaders?: Record<string, string>,
        authOverride?: AuthOverride
    ): Promise<any> {
        const options: RequestInit = {
            method,
            headers: this.buildHeaders(customHeaders, authOverride),
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Salesforce API call failed: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    public async parameterizedSearch(
        query: string,
        sObject: string,
        fields: string[],
        customHeaders?: Record<string, string>,
        authOverride?: AuthOverride
    ): Promise<any> {
        const url = `${this.authorizationData.instanceUrl}/services/data/v${this.apiVersion}/parameterizedSearch/?q=${encodeURIComponent(query)}&sobject=${sObject}&${sObject}.fields=${fields.join(',')}`;
        return this.apiCall(url, 'GET', undefined, customHeaders, authOverride);
    }

    public async upsertSObject(
        salesforceType: string,
        recordId: string | null,
        data: Record<string, any>,
        customHeaders?: Record<string, string>,
        authOverride?: AuthOverride
    ): Promise<any> {
        const url = recordId
            ? `${this.authorizationData.instanceUrl}/services/data/v${this.apiVersion}/sobjects/${salesforceType}/${recordId}`
            : `${this.authorizationData.instanceUrl}/services/data/v${this.apiVersion}/sobjects/${salesforceType}`;

        const method = recordId ? 'PATCH' : 'POST';
        return this.apiCall(url, method, data, customHeaders, authOverride);
    }

    public async upsertCustomSObject(
        salesforceType: string,
        recordId: string | null,
        data: Record<string, any>,
        customHeaders?: Record<string, string>,
        authOverride?: AuthOverride
    ): Promise<any> {
        const url = recordId
            ? `${this.authorizationData.instanceUrl}/services/data/v${this.apiVersion}/sobjects/${salesforceType}/${recordId}`
            : `${this.authorizationData.instanceUrl}/services/data/v${this.apiVersion}/sobjects/${salesforceType}`;

        const method = recordId ? 'PATCH' : 'POST';
        return this.apiCall(url, method, data, customHeaders, authOverride);
    }

    public parseResponse(response: any) {

    }

    public parseSearchResponse(response: any): any {
        return response.searchRecords.map((record: any) => ({
            id: record.Id,
            isConverted: record.IsConverted,
            convertedContactId: record.ConvertedContactId,
            isDeleted: record.IsDeleted,
        }));
    }

    public parseSObjectResponse(response: any): any {
        return {
            id: response.id,
            success: response.success,
            errors: response.errors || [],
        };
    }
}