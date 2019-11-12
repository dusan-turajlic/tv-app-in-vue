( () => {
    if ( !window.webapis ) {
        throw new Error( 'webapis must be defined' );
    }
    if ( !window.tizen ) {
        throw new Error( 'tizen must be defined' );
    }

    let keys = tizen.tvinputdevice.getSupportedKeys();
    keys.forEach( key => {
        if ( key.name !== 'Power' && key.name !== 'Source' ) {
            tizen.tvinputdevice.registerKey( key.name );
        }
    } )
} )();