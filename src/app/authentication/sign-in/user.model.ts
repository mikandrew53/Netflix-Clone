export class User {
    constructor (
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date,
    ){}

    get token() {
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
            return null;
        return this._token;
    }

    // setTMDB_token(token){
    //     // this._TMDB_token = token;        
    // }
    // get TMDB_token(){
    //     if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
    //         return null;
    //     return this._TMDB_token;
    // }
}