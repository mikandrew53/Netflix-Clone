export class user {
    constructor (
        public email: string,
        public id: string,
        private _token: string,
        private tokenExpirationDate: string,

        ){}

    getToken() {
        return this._token;
    }
}