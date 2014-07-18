Ext.define('rewpos.Print', {
	singleton: true,
    pathPrecuenta: 'something',

    precuenta: function(store) {
        //Create an ePOS-Print Builder object
        console.log('ePOS-Print');
        var builder = new epson.ePOSBuilder();
        //
        builder.addTextLang('en')
        builder.addTextSmooth(true);
        builder.addTextFont(builder.FONT_A);
        //Create a print document
        builder.addTextSize(3, 3);
        builder.addTextStyle(false, false, true, undefined);
        //reverse, ul, em, color {COLOR_NONE,COLOR_1,COLOR_2,COLOR_3,COLOR_4, undefined}
        builder.addText('Hello,\tWorld!\n');
        builder.addCut(builder.CUT_FEED);
        //Acquire the print document
        var request = builder.toString();
        console.log(request);
        //Set the end point address
        //var address = 'http://192.168.192.168/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000';
        var address = '//192.168.1.100/TMAVANCEC';
        //Create an ePOS-Print object
        var epos = new epson.ePOSPrint(address);
        //Set a response receipt callback function
        epos.onreceive = this.receive

        epos.onerror = function() {
            console.log('onerror');
        };

        epos.onoffline = function() {
            console.log('onoffline');
        };

        epos.onpoweroff = function() {
            console.log('onpoweroff');
        };
        epos.open();
        //Send the print document
        epos.send(request);
        console.log(epos);

        console.log('FIN ePOS-Print');
     },

     receive: function (res) {
        //When the printing is not successful, display a message
        if (!res.success) {
            console.log('A print error occurred');
        }

        // Obtain the print result and error code
        var msg = 'Print' + (res.success ? 'Success' : 'Failure') + '\ nCode: ' + res.code + '\ nStatus: \n';
        // Obtain the printer status
        var asb = res.status;
        if (asb & epos.ASB_NO_RESPONSE) {
            msg += ' No printer response\n';
        }
        if (asb & epos.ASB_PRINT_SUCCESS) {
            msg += ' Print complete\n';
        }
        if (asb & epos.ASB_DRAWER_KICK) {
            msg += ' Status of the drawer kick number 3 connector pin = "H"\n';
        }
        if (asb & epos.ASB_OFF_LINE) {
            msg += ' Offline status\n';
        }
        if (asb & epos.ASB_COVER_OPEN) {
            msg += ' Cover is open\n';
        }
        if (asb & epos.ASB_PAPER_FEED) {
            msg += ' Paper feed switch is feeding paper\n';
        }
        if (asb & epos.ASB_WAIT_ON_LINE) {
            msg += ' Waiting for online recovery\n';
        }
        if (asb & epos.ASB_PANEL_SWITCH) {
            msg += ' Panel switch is ON\n';
        }
        if (asb & epos.ASB_MECHANICAL_ERR) {
            msg += ' Mechanical error generated\n';
        }
        if (asb & epos.ASB_AUTOCUTTER_ERR) {
            msg += ' Auto cutter error generated\n';
        }
        if (asb & epos.ASB_UNRECOVER_ERR) {
            msg += ' Unrecoverable error generated\n';
        }
        if (asb & epos.ASB_AUTORECOVER_ERR) {
            msg += ' Auto recovery error generated\n';
        }
        if (asb & epos.ASB_RECEIPT_NEAR_END) {
            msg += ' No paper in the roll paper near end detector\n';
        }
        if (asb & epos.ASB_RECEIPT_END) {
            msg += ' No paper in the roll paper end detector\n';
        }
        if (asb & epos.ASB_BUZZER) {
            msg += ' Sounding the buzzer (limited model)\n';
        }
        if (asb & epos.ASB_SPOOLER_IS_STOPPED) {
            msg += ' Stop the spooler\n';
        }
        //Display in the dialog box
        console.log(msg);
    }
 });