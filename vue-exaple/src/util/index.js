import { memoize } from 'lodash'
// @TOOD: Remove this hard coded link for API
const URL = `http://${window.location.hostname}:8079`;

export default class Util {
    static async xhr( {method = 'GET', route, headers, body} ) {
        return new Promise( ( resolve, reject ) => {
            let xhr = new XMLHttpRequest();
            xhr.open( method, URL + route )
            if ( headers ) {
                Object.keys( headers ).forEach( key => {
                    xhr.setRequestHeader( key, headers[key] );
                } );
            }
            xhr.onload = memoize( () => {
                if ( xhr.status >= 200 && xhr.status < 300 ) {
                    try {
                        if ( xhr.response ) {
                            resolve( JSON.parse( xhr.response ) );
                        }
                    }
                    catch ( e ) {
                        resolve( xhr.response );
                    }
                }
                else {
                    reject( xhr.statusText );
                }
            } );
            xhr.onerror = () => reject( xhr.statusText );
            xhr.send( encodeURI( JSON.stringify( body ) ) );
        } );
    }
}