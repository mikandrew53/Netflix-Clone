export class User {
    constructor (
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date,
        private _TMDB_token?
    ){}

    get token() {
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
            return null;
        return this._token;
    }

    setTMDB_token(token){
        console.log('yo token');
        console.log(token);
        
        this._TMDB_token = token;
        console.log(this._TMDB_token);
        
    }
    get TMDB_token(){
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
            return null;
        return this._TMDB_token;
    }
}