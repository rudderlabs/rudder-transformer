export type ConsentStatus = 'CONSENT_STATUS_UNSPECIFIED' | 'CONSENT_GRANTED' | 'CONSENT_DENIED';

export type Encoding = 'ENCODING_UNSPECIFIED' | 'HEX' | 'BASE64';

export type AccountType =
  | 'ACCOUNT_TYPE_UNSPECIFIED'
  | 'GOOGLE_ADS'
  | 'DISPLAY_VIDEO_PARTNER'
  | 'DISPLAY_VIDEO_ADVERTISER'
  | 'DATA_PARTNER'
  | 'GOOGLE_ANALYTICS_PROPERTY'
  | 'GOOGLE_AD_MANAGER_AUDIENCE_LINK';

export type TermsOfServiceStatus = 'TERMS_OF_SERVICE_STATUS_UNSPECIFIED' | 'ACCEPTED' | 'REJECTED';

export interface Consent {
  adUserData?: ConsentStatus;
  adPersonalization?: ConsentStatus;
}

export interface ProductAccount {
  accountId: string;
  accountType?: AccountType;
}

export interface DataManagerDestination {
  operatingAccount: ProductAccount;
  productDestinationId: string;
  loginAccount?: ProductAccount;
}

export interface AddressInfo {
  givenName: string;
  familyName: string;
  regionCode: string;
  postalCode: string;
}

export interface UserIdentifier {
  emailAddress?: string;
  phoneNumber?: string;
  addressInfo?: AddressInfo;
}

export interface UserData {
  userIdentifiers: UserIdentifier[];
}

export interface MobileData {
  mobileIds: string[];
}

export interface UserIdData {
  userId: string;
}

export interface AudienceMember {
  consent?: Consent;
  userData?: UserData;
  mobileData?: MobileData;
  userIdData?: UserIdData;
}

export interface TermsOfService {
  customerMatchTermsOfServiceStatus?: TermsOfServiceStatus;
}

export interface GARLIngestAPIPayload {
  destinations: DataManagerDestination[];
  audienceMembers: AudienceMember[];
  consent?: Consent;
  validateOnly?: boolean;
  encoding?: Encoding;
  termsOfService?: TermsOfService;
}

export interface GARLRemoveAPIPayload {
  destinations: DataManagerDestination[];
  audienceMembers: AudienceMember[];
  validateOnly?: boolean;
  encoding?: Encoding;
}
