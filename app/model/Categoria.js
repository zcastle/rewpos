Ext.define('rewpos.model.Categoria', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id','nombre'],
        proxy: {
            type: 'rest',
            url: rewpos.AppGlobals.HOST+'categoria',
            //url: 'http://192.168.1.5:8080/REWServices/categoria/caja',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});