import NameId from "../NameId";

export interface KeyProp {
    key: {
        href: string;
    };
}

export interface NameIdKey extends KeyProp, NameId {}

export interface WowResponse {
    _links: {
        self: {
            href: string;
        };
    };
}

export interface BnetError {
    code: number;
    detail: string;
    type: string;
}
