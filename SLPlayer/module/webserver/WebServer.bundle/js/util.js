function isset ()
{
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: FremyCompany
    // +   improved by: Onno Marsman
    // +   improved by: Rafał Kukawski
    // *     example 1: isset( undefined, true);
    // *     returns 1: false
    // *     example 2: isset( 'Kevin van Zonneveld' );
    // *     returns 2: true

    var a = arguments,
        l = a.length,
        i = 0,
        undef;

    if (l === 0)
    {
        throw new Error('Empty isset');
    }

    while (i !== l)
    {
        if (a[i] === undef || a[i] === null)
        {
            return false;
        }
        i++;
    }
    return true;
}

// Query string for window urls
//http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
(function($) {
    $.urlParams = function(a) {
        if (!isset(a)) {
            a = window.location.search.substr(1).split('&');
        }
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=', 2);
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    };
})(jQuery);