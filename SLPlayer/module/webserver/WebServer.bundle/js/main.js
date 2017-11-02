Explorer = function () {

}


Explorer.prototype = {

    explorerDiv: null,
    currentData: null,

    constructor: function() {

    },

    loadItemsForPath: function(path) {

        // Create url
        var url = "/items";
        // var url = "";
        if (path) {
            url += "?path=" + path;
        } else {
//            console.log($.urlParams());
            if ($.urlParams()["path"]) {
                url += "?path=" + $.urlParams()["path"];
                
            }
        }
        // Make the ajex call
        $.ajax({
            url: url,
            context: this
        }).done(function(data) {
            // data = this.dummyData();
            this.currentData = $.parseJSON(data);
            this.updateUIWithData(this.currentData);
        });
    },

    uploadCanceled: function(fileName){
        // Create url
        var url = "/uploadCanceled";
        // var url = "";
        if (fileName) {
            url += "?fileName=" + fileName;
        }
        // Make the ajex call
        $.ajax({
            url: url,
            context: this,
            type : "POST"
               }).done(function(data) {
                       // Reload the items
                       explorer.loadItemsForPath(null);
                });

    },

    updateUIWithData: function(response) {
        // Check path
        if (response == null) {
            // There was an error
            return;
        }

        // Check and update title
        if (isset(response["title"])) {
            var title = response["title"];
            // $(explorerDiv).find("")
        }
        if ($.urlParams()["path"] != response["path"]) {
            history.pushState({}, '', "/?path=" + response["path"]);
        }

        // $(".items-container .mCSB_container").hide(2000, function () {
        //     $(this).empty();
        // });
        $(".items-container .mCSB_container").empty();

        if (isset(response["items"])) {
            var items = response["items"];
            if (items.length > 0) {
                var ul = $(".items-container .mCSB_container").append("<ul class='items-list'></ul>");
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];

                    var text="";
                    var img="";

                    if (item["type"] == "file") {

                        if (isset(item["name"])) {
                            text = "<div class='item-name-container'><span class='item-name' path='" + item["name"] + "' index='" + i + "'>" + item["name"] + "</span></div>";
                        }

                        if (isset(item["thumb"])) {
                            img = "<div class='img-container'><img src=\"" + item["thumb"] + "\" class='thumb'></div>";
                        } else if (isset(item["icon"])) {
                            img = "<div class='img-container'><img src=\"" + item["icon"] + "\" class='file-icon'></div>";
                        }


                        var itemHtml = $(".items-container .items-list")
                            .append("<li class='item'>" + img + text + "</li>")
                    } else {
                        if (isset(item["name"])) {
                            text = "<div class='item-name-container'><span class='item-name'>" + item["name"] + "</span></div>";
                        }

                        if (isset(item["icon"])) {
                            img = "<div class='img-container'><img src=\"" + item["icon"] + "\" class='folder'></div>";
                        }

                        $(".items-container .items-list").hide()
                            .append("<li class='item'>" + img + text + "</li>")
                            .fadeIn(300);

                    }
                }
            }

            $(".items-container .items-list .item").hover(
                function() {
                    $( this ).find(".item-name").addClass( "hover" );
                }, function() {
                    $( this ).find(".item-name").removeClass( "hover" );
                }
            );

            $(".items-container .items-list .item").click(this,
                function(event) {
                    var items = event.data.currentData["items"]
                    var index = $(this).index();
                    if (index >= 0 && index < items.length) {
                        // process the click
                        // check if we have a file or folder
                        var item = items[index];
                        if (item["type"] == "file") {
                            window.location.href = 'download?path=' + item["path"];
                        } else if (item["type"] == "folder") {
                            event.data.loadItemsForPath(item["path"]);
                        }
                    }

                    // alert(event.data["items"][0]["type"]);
                    // console.log(event.data["items"][0]);
                    // console.log($(".items-container .items-list .item").index(this));
                }
            );


            $(".items-container").mCustomScrollbar("update");
            // $(explorerDiv).find("")
        }
    },


    dummyData: function() {
    var jsonObject = "{\"items\":[{\"type\":\"folder\",\"name\":\"fbfg\",\"icon\":\"data:image\/png;base64, iVBORw0KGgoAAAANSUhEUgAAAOoAAACvCAYAAADzAUKRAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAhOAAAITgBRZYxYAAAABxpRE9UAAAAAgAAAAAAAABYAAAAKAAAAFgAAABXAAALDtD\/AHsAAAraSURBVHgB7F0JcFxlHV\/BIhY5PQCLo4CDAsKMyDgjCgoWjxEUxQNHqvXCq+OJTDlGooxNdrdSadWapuTthlA7m90tpZ1KasLmXdtMyVAqpPvebqhllAptoS2UlrbQ9fd\/2SMLaXbT7OZ9Nb\/O\/Pu2fS\/vbX7H9\/\/uFwhM0p+mpvwxd8fSM8JJ+wuhZPq3wbi9JJSwlyNiUyOsaDhht4QT1neDyXXn5\/P5N0wS9HwMEagNgQUJ48xw3PoqDHkXxNoFo6bw+RHE44gnpkTE7Q343U38ritRSN3jGTZmvU8KsNpQ5FVEoEEINKVSb\/RMmkj\/vGDKl3HMMzwMng3F03eHEusuaW0dmNYgCnhbIlAdgVBs\/RnBhLUAxnwGsZ8GrSikXgUe+0IJ6\/6WpPWxpljqLdUR5RVEoM4INMfS75W2KMT4FA1aYdDX1ih2BhP23ySz1pkC3o4IVEcA5pyN2EGTjmnSomlfQDV4Ljra3lEdWV5BBOqAgLRLwzH97HAivYgmrcmkYtb9XkdT3L6+DhTwFkSgOgJNWup4VOVmQXzraNSajXqogFWwOsK8ggjUAQHpFIHo5iOep1FrNupwFThpLwuutE6sAw28BREYG4GFnf0nwaCdNOk4TYphK9REVrfErQubYoPHjY0yzxKBCSLQEhs4OZS0u2nU8RsVmD2M4awrOVQzQRHyx6sjsGBF6hRkBp1GHb9RBbeWePrTrP5W1xmvmCACYtTCVLni0AOPtc\/GYkadoP744zUiQKOOP5OOqH30zk\/YV4Q7uk+oEW5eRgSODIHXGFWmyf0\/RHH4pLG1g6TdE+qyLm+0UWXlDqP+GByZY3z6KTEq5q9ahSyxC8dd6Fza3ZCQezc+XsAzMCfXbrhZJ6vXNxaLHSs9y7IYgFE\/DJRfCSWlc9OqgemhFfa5EPRszPEdxFGyz7ZCbMexnvGcZ\/xEek+o4WG\/hO9+ANFwo+J3cmQJHJ51B+IW9ADfWu9AIXqbzMHGzLF5eMbvGRPHQLD08PTWWVtzwnHzWnQIvtOnXHn4xzavNk8NJq2rg4n0UhC\/BYEsJCaydzYmvHsfxL0bWxXl\/Ynv+DWwN4S1xygMb25OmOdgs4Q3H945k3hGSg6Y8iaYpg8hVcRXENIulaOYqREh96eIiIGKGpCal6y7lgUpnVho8RFfJ7B41V3sToB21SyvBBk2qYrA8TvR0H5pQKbRxoNd6U9OYu6sfJRMvkdpcRWy6YP4Mn4BwecS+6NAA9gvK2l\/wJfMKu1SGLQNsZdGZUFFDYyhARn1iFt\/Qnv1tMp01+B\/eWtOE+tmjujdPQpKtTGAZFYifw3WAGbr5cJx+0YZvmywPcu3b3kgfVFhGEH2QiLJxIAaqKIBGPVFeKU31GV\/quykBn9CJr0GbdMBPFh6eUkSMaAGatPAwVDS+kWD7Vm+fUuX\/oNg3DqEyDOIATVQuwaau4zOcLz\/4rp2LDXl88e0DgxMW7gm9yYJfJ4uA7hoGDeHk+k8gxhQA+PTAAo1955V6+e29Tx+uqQ+8VVscPA48Vo5FY7zk5bacMoSPXPZkr7M9zXTvTOqZ1uW9g7+cfHajY\/8pfuxPIMYUAPj08CfH9pw4K9rN26IGNkFnfbQ7VHd+dm9uvP5xb3ujHHaMxDQUv86vsNyLo3o2ZujppuI6C5u7D6N2B41sy\/ieLBdz+QZxIAaOCINHISHdiC2Rkw3g2MPfNas9WWvjvZk3lqTYSUVR\/ucK+H4lbjBPkSeQQyogcnQQHZAM7KzO+yh6vs7R8zs1zXD7Qcxu0jOZJDDZ1BnJQ0cABabEbdqqcEzUtgj+3XZ9V7LOTFqOF9GKjYIXAk41iZYo\/JDA27UcG\/rTOXOep1RI2bmQxHDSdOkNCk14L8GYNQtUrttHdg6vWTWqJk5D+TMQ2wjSf6TRA7IATSwB2bt1UznM55RY7H8sVHd\/ZbnYMOVOrIfqZ7PJO7UwCga0HS3yTPq\/eY\/T40a2d\/RoCygqAH1NICO3Yg0SwPtRu4StE0XkyT1SCIn5AQaWI0O3m8GZJDVc+0oaZdCoVCoAX81IO1UTDj6VUAzM59ARm0nIf4SQvyJ\/6gaMN21MOucAKaAXYYL2ka9iFmWHRzUgM8acLqRSH\/ENiqF6LMQmUnHTJK6uwZDNN8JRKzchbhw0ZgXU8wUMzXglwZWYcbgjYGInTtXltzQqCzZqQH1NICO3geQUb8SuM\/YdCYcGyJJ6pFETsiJLDOFWa8LLE0PngZByPRBv1I7n0vsqYHDaiDbhRrv5wId3RtPiJjOXTQqCypqQD0NIJsux2YNMwOy5g3p9U6SpB5J5IScIJt2an3u5d58X2y5cgdFQVFQA0pq4D6Mo37UMypm6M8lSUqSxLbbYdtuU4YvLarnPugZFVXfX9KoU4Z4mv\/oMn8bFs5cMFz1NbM\/hVFlZzSSSAyoAbU00NahZ88vZtQfox78Eox6iGZlYUUNqKQBZ7GWyrynmFFvQu\/S8yDoVZKkEkn8LtSju0h2JPSMKpN+AciziFcIDM1BDaijASxxW4g26tsLRnVncc8kdcihUchFWQN49UV\/7qRhoxruDTCqg5P7yxcQLGJBDfivAScsb6\/wjOptvG24G\/GlXvb\/i1Ec5IAaKGsgG5SdQosZ9TqcWI\/YW76AYBELakABDczzTCp\/YdLvNfhCVmGIhuNoao2jkY+pzAcWzJSMKrtxY0vCh2HWPQqUIBTmVBYmf\/cK\/Zc24C5k1JnYknANTCrvPq24kP8mHtSArxr4TSmjYvXMFbKSHITsJim+ksJCkomiUgNY2VYyamHL0GUwKd+JSqFUCoV4+IyHc0vJqBhD\/TBMqhWmEfr8xZjRWKuhBooawBvIf102Kta7oY3aipPPFS\/gkWKhBvzXgCxBLRvVcC4GKbK37w6S4z855IAcFDSwH7XdOSWjyno3DM\/Mx8ntFAlFQg0ooQFZcroXNd2flIwqm3AX3pEqK2jYRiUG1ID\/GhCj7kYb9Ycloy61N707YmZvR1Z9hkZlQUUNKKEBWXK6DVXf75WMGk27M6R3CSf+S5KUIIkZzf+M5jcHsjXSViTQb5eM2taz+XT8h+yb9DSNSqNSA0poAEZ1nvLeNl506rKU+zapC6Ph+h+SpARJfpfmfL7\/Gf0AvDgU0Z1vFH0aaP3HkydLisWJf9OoNCo1oIQGZG34pqjufq1s1IGt0\/GOixu8VOt\/ScLSnBxQA4a7Dx1Jj2G24PUjjDowDTMgvogTW1iaKlGaUqgsrPbBi49qevZLJaPKh6jlfhYnNtOoNCo1oIQGsNuKk9bM3LUVRm3XnatA0JMkSQmSmFGZUfdohtMnCbTCqLImFSYdolFpVGpACQ2MblS0T2WpW44kKUESMyozquy28nfvJcYjU6qmZy7CCZdGpVGpASU0ILutrOgwch8f6VPsRJg5D1lVNuFmaU4MqAH\/NTC6UdvN7Dkw6RM0KgsqakAJDezC3Ibl6Pkdftt4Ma126M7ZIOhRkqQEScxo\/mc0vznYCaNGpO+o6FHvKO9gxIl+GpVGpQZU0IC8BtVp77CcSyuM6q1JNVydJKlAEr8DdYj9y7CPWRT7mVUYtV0fehdW0DxEgGgSakAJDexAtXehjMZUGLUzlTsLS2oeJElKkOR3+4jP97+NvB1N0T\/gJcYXVBhVdnnAvkkxGFXWwZEoYkAN+KuBbVg5E9RS7vvFqP8DAAD\/\/3kp1CgAAAntSURBVO2dCWwUVRzGRVEUxJt44n1Go4lnvCLxDBrRqHgHJUbFO14kKF6JiQeJB2qwCju7S5VYNQZFFMEsM1MqCcVYcLvzZluKIigiR8ATxfX7r9tkHtuZmridt818TSadN912t+\/7fu\/\/5r0377\/NNpWvac3efmnHb0w76lccJR6sA3rAqAdWp23vactuP6Kb0fL36U77vmnHS0GcjRTIqEBsJBkoSmlX\/ZC2\/YlWrnCwBqqVy+8DUKcA0rUElaDSA8Y98D00mJBt7jxQA\/XNecv2Rtf3xTLJbNEY1egB0x4AqN74xlzxAA3UlFMcZtn+s6B4BVtT462paZPw\/c03VCstx79HAqgG6ts5tZdlqycBaRdBJaj0gGEP2Oo7gDpOuNRAzcwr7Jlx1CPo\/voUybBI5ltzRlTTGgDUtOvfNrUlv4cGqlwAwQ\/jHrVAUAkqPWDcA9+CxTGYNh2qgfqWu2R3EHwvBFpCkYyLxIhmOqIZf3\/vG8tR1za0rhqsgWrlunbDD27FSNNigkpQ6QHTHgCorjcaXO6ogdowt3NXCbWAdSFFMi0S3z\/pHsR40XKweHkulxuogdq4sLgLlixdjQpyk15J\/P\/ZUNSBB5ZlmtVIDVIpNOXyOwvBGPXN1cGH5D2a8XskwmqYg2UZ1z+\/Z1BtdTE+3FzDH5CQElJ6wFGdllsYUQWqjC4B0PPStppNUBlN6AHjHuhI2YUzqkBtalmxE0Z8z0TXdyZFMi4SI0riexVYeOQWTqoCVYaBs83eyYD1PYJKUOkB0x7wfay\/P7EK1Mmzi4PSzcVjIdAMimRaJL4\/PaiU8FgFalM+v0PGLRyJCprOSiIo9IBhD2Apb8r1D60CtaG1dXt5mhwCWRTJsEiJvz9j\/cua+x5BlRUQsh0LVkS8QVBpFHrAuAfasrZ3SFVEfbJU2lYW5uOZ1NcoknGROOqb8F6FLOWt2i9JqC2VSgPKc6m29zJBJaj0gGEP2OqLHkHthhXTM5MokmGREh5N6D\/4z1XO1AXtB1V1fbsvZFz1DCuKoNIDhj3gqs9Sdsfwbi6rvsumvxTJsEiMqLxHd9QnkaAioj5BUAkqPWDYA7b3YdVWocGw+u8GZ4Y\/JCMKI0qyPfCnLOXNtKj9g2xq53jBeLambKjoAaMe+B31P0PyQWlwBgt4wf0UyahIjKbJjqbQ3\/sFPdtsJKiyOzdAReilWVkH9IAhDyBRm5eSlYLBIKqd4wV3CNGGPiCjCRtIeqCcqM2bIonbNDiDBSxdwpah\/jqAuoWwMqLQA0Y88COmSV+uyjsTBBWbcI+FOJLy7S+KZEQkRhT2KlZbrv9SJKgZx7sRgC7DsZmgElR6wIgHVsgKQcmwGAyi2nnGVtdAnHYcf1AkIyIxojKidoG9p6oyuQVJxf3plXhRG47fCCpBpQeMeKBLUqBGglrehNtWiyDQrxTJiEiMqImPqOXUpxMkFWowiGrniKiXAFCkteAUDRsqNlSGPJDHPeoDVblRg6RmncJFWBXxOT7gJkMfkhEl8REl4Q2E6y\/N2N59kaCmbO9cADoLB1ZHJLzC+P+z0TTgAQTKrxBR75StkYJBVDu35quz0f19F5BuIKhsqOgBAx6QMSLbu0VyFmtwBguS7wLivI1jPUUyIJKBFpw615fOsrEZpklvkpzFQTa1c4TdUyGchWMtBawvAalHQvTAxmay8EhyFmtwBguS7wIpyV+HKX6iMRJiDEbx+roXx8ZmYHA0HnMbGmRTOwfJx8uCYEC6hqASVHogfg+UZ11sb5QkF9fgDBasnDrasv1nIdBqihS\/SKxz1rmAarnFSyNBTS8oHlbZ4EyeoKmvLgE\/D\/VIgAewecOnabt4YXZO25BgENXOZdNfADoBxyqCyoaKHjDgAexAKNOkklxcgzNYkC0K07b\/EARaSZEMiJSAiEFf9eIrgJptVmdFgirbP1T2TVrBCu2lQgkVu+J944EPsq5\/WiSo8mhNxvZvB6TfElSCSg8Y8ICr3pnmqhMmzy4OCvZ2tXNZDYEENWMw8rScIhkQqW9aaEa+\/lWvM7K59uMiQZVwi7nUqwCpbMdCgVkH9EDsHvAbZZq0KZ\/fQYuiwYL8EKBeBkg7CSobKnogfg9grW865fqHNrS2bh9kUzuXzOOZZjUSAnVQpPhFYp2zzjFGNE1mX3K53EANzq0LlWdSizQNTUMPxO8BjA+9IbMvvYIqczgQSFGk+EVinbPOsQ3SFJl9aWoqbbd1ENXK8gQNRn4LNA1NQw\/E7wFE1MmyzlduQzUwty5kbf8YCJSnSPGLxDpnnWOHlRdlaqZUKg3Ymk2tPD3XcTgM8zVNQ9PQA0Y88ILMvvQKamVh\/hKKZEQkzlvGPm9Zbzr7z2mRM6yQsjuG44Z2MUGtNwH5eRLhSdt7OoxN7Xr5CRrHa0lEpSS+9Sb8defz\/wpqpkXtL0+Z190\/QKjYLU6GBx7XImdYAZsq7QdQPyaojDb0gAEPuP6jYWxq16c77ftCoA8okgGRkhEx2DOI1nmCBmRYQZYvYcHDOwD1T8JKWOmBeD2AjRseDmNTuy4pydH1zUIg5kiNbvkYGVg\/feGB+zUgwwoCKqZnUgD1Z7am8bamrG\/Wt2RyC2NTu461vsOQ8fg1mIZpLRgx+iJi8G+G+2ozerN3a0CGFWTlPiLqJIDKvX3DK5RmY93U2gN\/g7lNuEcdF8amdl1SkmMT7mfStvqOXTF2xeiB2DywBXW9Fjs83KoBGVaQTMeV3fK7KFJsItW6debf638RX0BdI7lRw9jUrkumY\/wCdsv3fYJKUOmB2DzwF+p6Jbq+N2tAhhXKoNrqQfxSO0WKTSRGwP4XAWut2Wbw1omIekMYm9r18t6+troLv9RGUAkqPRCbB\/4o92Jd\/zoNyLCCJFBF6sXrMUy8gCLFJlKtW2f+vf4XoWWB0Zdg74owNrXrDa2rBlvz\/QvwS58QVIJKD8TmgY3CXMb1z9eADCvI7mcy8ov1vq9SpNhEYgTsfxGw1pqtQibFiVnbOySMzR6vp11\/LED9EYcMG9f6Q\/HvsU7pgaAHbLVI8qL2CGPURaS2OB6AvlKBlZUarFSe0w+19cBK8Pa8PGIaxWSPP5Nd0DLzi6djJGomYOUjb7UVhkZnfXZ7YIvleq9jEPeoyMRQPVJauZid0zZERqEA6iwcfOyN5uo2F7\/XxgtYT+\/PtNzCiCgOe\/2ZRNXuxFFYVvg+YF2PgyKxDuiB\/+0Bfx1YsnBfekqve\/j2SmrlBY0Li7tkneI5luM9hidr5uANJNvbBhwcaPrfgrHhg4+SAL7cPq7HIO3Sf28nvfHZZu\/kyITF\/xXQ4OsksspiCLzRdXjDj3BIsmPeuybDZEkAqS\/\/R3mE7XdhRtIqYpngKFmqG+Qr6vwfrbb0TT3rO34AAAAASUVORK5CYII=\"},{\"type\":\"folder\",\"name\":\"hdhdbfdf\",\"icon\":\"data:image\/png;base64, iVBORw0KGgoAAAANSUhEUgAAAOoAAACvCAYAAADzAUKRAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAhOAAAITgBRZYxYAAAABxpRE9UAAAAAgAAAAAAAABYAAAAKAAAAFgAAABXAAALDtD\/AHsAAAraSURBVHgB7F0JcFxlHV\/BIhY5PQCLo4CDAsKMyDgjCgoWjxEUxQNHqvXCq+OJTDlGooxNdrdSadWapuTthlA7m90tpZ1KasLmXdtMyVAqpPvebqhllAptoS2UlrbQ9fd\/2SMLaXbT7OZ9Nb\/O\/Pu2fS\/vbX7H9\/\/uFwhM0p+mpvwxd8fSM8JJ+wuhZPq3wbi9JJSwlyNiUyOsaDhht4QT1neDyXXn5\/P5N0wS9HwMEagNgQUJ48xw3PoqDHkXxNoFo6bw+RHE44gnpkTE7Q343U38ritRSN3jGTZmvU8KsNpQ5FVEoEEINKVSb\/RMmkj\/vGDKl3HMMzwMng3F03eHEusuaW0dmNYgCnhbIlAdgVBs\/RnBhLUAxnwGsZ8GrSikXgUe+0IJ6\/6WpPWxpljqLdUR5RVEoM4INMfS75W2KMT4FA1aYdDX1ih2BhP23ySz1pkC3o4IVEcA5pyN2EGTjmnSomlfQDV4Ljra3lEdWV5BBOqAgLRLwzH97HAivYgmrcmkYtb9XkdT3L6+DhTwFkSgOgJNWup4VOVmQXzraNSajXqogFWwOsK8ggjUAQHpFIHo5iOep1FrNupwFThpLwuutE6sAw28BREYG4GFnf0nwaCdNOk4TYphK9REVrfErQubYoPHjY0yzxKBCSLQEhs4OZS0u2nU8RsVmD2M4awrOVQzQRHyx6sjsGBF6hRkBp1GHb9RBbeWePrTrP5W1xmvmCACYtTCVLni0AOPtc\/GYkadoP744zUiQKOOP5OOqH30zk\/YV4Q7uk+oEW5eRgSODIHXGFWmyf0\/RHH4pLG1g6TdE+qyLm+0UWXlDqP+GByZY3z6KTEq5q9ahSyxC8dd6Fza3ZCQezc+XsAzMCfXbrhZJ6vXNxaLHSs9y7IYgFE\/DJRfCSWlc9OqgemhFfa5EPRszPEdxFGyz7ZCbMexnvGcZ\/xEek+o4WG\/hO9+ANFwo+J3cmQJHJ51B+IW9ADfWu9AIXqbzMHGzLF5eMbvGRPHQLD08PTWWVtzwnHzWnQIvtOnXHn4xzavNk8NJq2rg4n0UhC\/BYEsJCaydzYmvHsfxL0bWxXl\/Ynv+DWwN4S1xygMb25OmOdgs4Q3H945k3hGSg6Y8iaYpg8hVcRXENIulaOYqREh96eIiIGKGpCal6y7lgUpnVho8RFfJ7B41V3sToB21SyvBBk2qYrA8TvR0H5pQKbRxoNd6U9OYu6sfJRMvkdpcRWy6YP4Mn4BwecS+6NAA9gvK2l\/wJfMKu1SGLQNsZdGZUFFDYyhARn1iFt\/Qnv1tMp01+B\/eWtOE+tmjujdPQpKtTGAZFYifw3WAGbr5cJx+0YZvmywPcu3b3kgfVFhGEH2QiLJxIAaqKIBGPVFeKU31GV\/quykBn9CJr0GbdMBPFh6eUkSMaAGatPAwVDS+kWD7Vm+fUuX\/oNg3DqEyDOIATVQuwaau4zOcLz\/4rp2LDXl88e0DgxMW7gm9yYJfJ4uA7hoGDeHk+k8gxhQA+PTAAo1955V6+e29Tx+uqQ+8VVscPA48Vo5FY7zk5bacMoSPXPZkr7M9zXTvTOqZ1uW9g7+cfHajY\/8pfuxPIMYUAPj08CfH9pw4K9rN26IGNkFnfbQ7VHd+dm9uvP5xb3ujHHaMxDQUv86vsNyLo3o2ZujppuI6C5u7D6N2B41sy\/ieLBdz+QZxIAaOCINHISHdiC2Rkw3g2MPfNas9WWvjvZk3lqTYSUVR\/ucK+H4lbjBPkSeQQyogcnQQHZAM7KzO+yh6vs7R8zs1zXD7Qcxu0jOZJDDZ1BnJQ0cABabEbdqqcEzUtgj+3XZ9V7LOTFqOF9GKjYIXAk41iZYo\/JDA27UcG\/rTOXOep1RI2bmQxHDSdOkNCk14L8GYNQtUrttHdg6vWTWqJk5D+TMQ2wjSf6TRA7IATSwB2bt1UznM55RY7H8sVHd\/ZbnYMOVOrIfqZ7PJO7UwCga0HS3yTPq\/eY\/T40a2d\/RoCygqAH1NICO3Yg0SwPtRu4StE0XkyT1SCIn5AQaWI0O3m8GZJDVc+0oaZdCoVCoAX81IO1UTDj6VUAzM59ARm0nIf4SQvyJ\/6gaMN21MOucAKaAXYYL2ka9iFmWHRzUgM8acLqRSH\/ENiqF6LMQmUnHTJK6uwZDNN8JRKzchbhw0ZgXU8wUMzXglwZWYcbgjYGInTtXltzQqCzZqQH1NICO3geQUb8SuM\/YdCYcGyJJ6pFETsiJLDOFWa8LLE0PngZByPRBv1I7n0vsqYHDaiDbhRrv5wId3RtPiJjOXTQqCypqQD0NIJsux2YNMwOy5g3p9U6SpB5J5IScIJt2an3u5d58X2y5cgdFQVFQA0pq4D6Mo37UMypm6M8lSUqSxLbbYdtuU4YvLarnPugZFVXfX9KoU4Z4mv\/oMn8bFs5cMFz1NbM\/hVFlZzSSSAyoAbU00NahZ88vZtQfox78Eox6iGZlYUUNqKQBZ7GWyrynmFFvQu\/S8yDoVZKkEkn8LtSju0h2JPSMKpN+AciziFcIDM1BDaijASxxW4g26tsLRnVncc8kdcihUchFWQN49UV\/7qRhoxruDTCqg5P7yxcQLGJBDfivAScsb6\/wjOptvG24G\/GlXvb\/i1Ec5IAaKGsgG5SdQosZ9TqcWI\/YW76AYBELakABDczzTCp\/YdLvNfhCVmGIhuNoao2jkY+pzAcWzJSMKrtxY0vCh2HWPQqUIBTmVBYmf\/cK\/Zc24C5k1JnYknANTCrvPq24kP8mHtSArxr4TSmjYvXMFbKSHITsJim+ksJCkomiUgNY2VYyamHL0GUwKd+JSqFUCoV4+IyHc0vJqBhD\/TBMqhWmEfr8xZjRWKuhBooawBvIf102Kta7oY3aipPPFS\/gkWKhBvzXgCxBLRvVcC4GKbK37w6S4z855IAcFDSwH7XdOSWjyno3DM\/Mx8ntFAlFQg0ooQFZcroXNd2flIwqm3AX3pEqK2jYRiUG1ID\/GhCj7kYb9Ycloy61N707YmZvR1Z9hkZlQUUNKKEBWXK6DVXf75WMGk27M6R3CSf+S5KUIIkZzf+M5jcHsjXSViTQb5eM2taz+XT8h+yb9DSNSqNSA0poAEZ1nvLeNl506rKU+zapC6Ph+h+SpARJfpfmfL7\/Gf0AvDgU0Z1vFH0aaP3HkydLisWJf9OoNCo1oIQGZG34pqjufq1s1IGt0\/GOixu8VOt\/ScLSnBxQA4a7Dx1Jj2G24PUjjDowDTMgvogTW1iaKlGaUqgsrPbBi49qevZLJaPKh6jlfhYnNtOoNCo1oIQGsNuKk9bM3LUVRm3XnatA0JMkSQmSmFGZUfdohtMnCbTCqLImFSYdolFpVGpACQ2MblS0T2WpW44kKUESMyozquy28nfvJcYjU6qmZy7CCZdGpVGpASU0ILutrOgwch8f6VPsRJg5D1lVNuFmaU4MqAH\/NTC6UdvN7Dkw6RM0KgsqakAJDezC3Ibl6Pkdftt4Ma126M7ZIOhRkqQEScxo\/mc0vznYCaNGpO+o6FHvKO9gxIl+GpVGpQZU0IC8BtVp77CcSyuM6q1JNVydJKlAEr8DdYj9y7CPWRT7mVUYtV0fehdW0DxEgGgSakAJDexAtXehjMZUGLUzlTsLS2oeJElKkOR3+4jP97+NvB1N0T\/gJcYXVBhVdnnAvkkxGFXWwZEoYkAN+KuBbVg5E9RS7vvFqP8DAAD\/\/3kp1CgAAAntSURBVO2dCWwUVRzGRVEUxJt44n1Go4lnvCLxDBrRqHgHJUbFO14kKF6JiQeJB2qwCju7S5VYNQZFFMEsM1MqCcVYcLvzZluKIigiR8ATxfX7r9tkHtuZmridt818TSadN912t+\/7fu\/\/5r0377\/NNpWvac3efmnHb0w76lccJR6sA3rAqAdWp23vactuP6Kb0fL36U77vmnHS0GcjRTIqEBsJBkoSmlX\/ZC2\/YlWrnCwBqqVy+8DUKcA0rUElaDSA8Y98D00mJBt7jxQA\/XNecv2Rtf3xTLJbNEY1egB0x4AqN74xlzxAA3UlFMcZtn+s6B4BVtT462paZPw\/c03VCstx79HAqgG6ts5tZdlqycBaRdBJaj0gGEP2Oo7gDpOuNRAzcwr7Jlx1CPo\/voUybBI5ltzRlTTGgDUtOvfNrUlv4cGqlwAwQ\/jHrVAUAkqPWDcA9+CxTGYNh2qgfqWu2R3EHwvBFpCkYyLxIhmOqIZf3\/vG8tR1za0rhqsgWrlunbDD27FSNNigkpQ6QHTHgCorjcaXO6ogdowt3NXCbWAdSFFMi0S3z\/pHsR40XKweHkulxuogdq4sLgLlixdjQpyk15J\/P\/ZUNSBB5ZlmtVIDVIpNOXyOwvBGPXN1cGH5D2a8XskwmqYg2UZ1z+\/Z1BtdTE+3FzDH5CQElJ6wFGdllsYUQWqjC4B0PPStppNUBlN6AHjHuhI2YUzqkBtalmxE0Z8z0TXdyZFMi4SI0riexVYeOQWTqoCVYaBs83eyYD1PYJKUOkB0x7wfay\/P7EK1Mmzi4PSzcVjIdAMimRaJL4\/PaiU8FgFalM+v0PGLRyJCprOSiIo9IBhD2Apb8r1D60CtaG1dXt5mhwCWRTJsEiJvz9j\/cua+x5BlRUQsh0LVkS8QVBpFHrAuAfasrZ3SFVEfbJU2lYW5uOZ1NcoknGROOqb8F6FLOWt2i9JqC2VSgPKc6m29zJBJaj0gGEP2OqLHkHthhXTM5MokmGREh5N6D\/4z1XO1AXtB1V1fbsvZFz1DCuKoNIDhj3gqs9Sdsfwbi6rvsumvxTJsEiMqLxHd9QnkaAioj5BUAkqPWDYA7b3YdVWocGw+u8GZ4Y\/JCMKI0qyPfCnLOXNtKj9g2xq53jBeLambKjoAaMe+B31P0PyQWlwBgt4wf0UyahIjKbJjqbQ3\/sFPdtsJKiyOzdAReilWVkH9IAhDyBRm5eSlYLBIKqd4wV3CNGGPiCjCRtIeqCcqM2bIonbNDiDBSxdwpah\/jqAuoWwMqLQA0Y88COmSV+uyjsTBBWbcI+FOJLy7S+KZEQkRhT2KlZbrv9SJKgZx7sRgC7DsZmgElR6wIgHVsgKQcmwGAyi2nnGVtdAnHYcf1AkIyIxojKidoG9p6oyuQVJxf3plXhRG47fCCpBpQeMeKBLUqBGglrehNtWiyDQrxTJiEiMqImPqOXUpxMkFWowiGrniKiXAFCkteAUDRsqNlSGPJDHPeoDVblRg6RmncJFWBXxOT7gJkMfkhEl8REl4Q2E6y\/N2N59kaCmbO9cADoLB1ZHJLzC+P+z0TTgAQTKrxBR75StkYJBVDu35quz0f19F5BuIKhsqOgBAx6QMSLbu0VyFmtwBguS7wLivI1jPUUyIJKBFpw615fOsrEZpklvkpzFQTa1c4TdUyGchWMtBawvAalHQvTAxmay8EhyFmtwBguS7wIpyV+HKX6iMRJiDEbx+roXx8ZmYHA0HnMbGmRTOwfJx8uCYEC6hqASVHogfg+UZ11sb5QkF9fgDBasnDrasv1nIdBqihS\/SKxz1rmAarnFSyNBTS8oHlbZ4EyeoKmvLgE\/D\/VIgAewecOnabt4YXZO25BgENXOZdNfADoBxyqCyoaKHjDgAexAKNOkklxcgzNYkC0K07b\/EARaSZEMiJSAiEFf9eIrgJptVmdFgirbP1T2TVrBCu2lQgkVu+J944EPsq5\/WiSo8mhNxvZvB6TfElSCSg8Y8ICr3pnmqhMmzy4OCvZ2tXNZDYEENWMw8rScIhkQqW9aaEa+\/lWvM7K59uMiQZVwi7nUqwCpbMdCgVkH9EDsHvAbZZq0KZ\/fQYuiwYL8EKBeBkg7CSobKnogfg9grW865fqHNrS2bh9kUzuXzOOZZjUSAnVQpPhFYp2zzjFGNE1mX3K53EANzq0LlWdSizQNTUMPxO8BjA+9IbMvvYIqczgQSFGk+EVinbPOsQ3SFJl9aWoqbbd1ENXK8gQNRn4LNA1NQw\/E7wFE1MmyzlduQzUwty5kbf8YCJSnSPGLxDpnnWOHlRdlaqZUKg3Ymk2tPD3XcTgM8zVNQ9PQA0Y88ILMvvQKamVh\/hKKZEQkzlvGPm9Zbzr7z2mRM6yQsjuG44Z2MUGtNwH5eRLhSdt7OoxN7Xr5CRrHa0lEpSS+9Sb8defz\/wpqpkXtL0+Z190\/QKjYLU6GBx7XImdYAZsq7QdQPyaojDb0gAEPuP6jYWxq16c77ftCoA8okgGRkhEx2DOI1nmCBmRYQZYvYcHDOwD1T8JKWOmBeD2AjRseDmNTuy4pydH1zUIg5kiNbvkYGVg\/feGB+zUgwwoCKqZnUgD1Z7am8bamrG\/Wt2RyC2NTu461vsOQ8fg1mIZpLRgx+iJi8G+G+2ozerN3a0CGFWTlPiLqJIDKvX3DK5RmY93U2gN\/g7lNuEcdF8amdl1SkmMT7mfStvqOXTF2xeiB2DywBXW9Fjs83KoBGVaQTMeV3fK7KFJsItW6debf638RX0BdI7lRw9jUrkumY\/wCdsv3fYJKUOmB2DzwF+p6Jbq+N2tAhhXKoNrqQfxSO0WKTSRGwP4XAWut2Wbw1omIekMYm9r18t6+troLv9RGUAkqPRCbB\/4o92Jd\/zoNyLCCJFBF6sXrMUy8gCLFJlKtW2f+vf4XoWWB0Zdg74owNrXrDa2rBlvz\/QvwS58QVIJKD8TmgY3CXMb1z9eADCvI7mcy8ov1vq9SpNhEYgTsfxGw1pqtQibFiVnbOySMzR6vp11\/LED9EYcMG9f6Q\/HvsU7pgaAHbLVI8qL2CGPURaS2OB6AvlKBlZUarFSe0w+19cBK8Pa8PGIaxWSPP5Nd0DLzi6djJGomYOUjb7UVhkZnfXZ7YIvleq9jEPeoyMRQPVJauZid0zZERqEA6iwcfOyN5uo2F7\/XxgtYT+\/PtNzCiCgOe\/2ZRNXuxFFYVvg+YF2PgyKxDuiB\/+0Bfx1YsnBfekqve\/j2SmrlBY0Li7tkneI5luM9hidr5uANJNvbBhwcaPrfgrHhg4+SAL7cPq7HIO3Sf28nvfHZZu\/kyITF\/xXQ4OsksspiCLzRdXjDj3BIsmPeuybDZEkAqS\/\/R3mE7XdhRtIqYpngKFmqG+Qr6vwfrbb0TT3rO34AAAAASUVORK5CYII=\"},{\"type\":\"folder\",\"name\":\"test\",\"icon\":\"data:image\/png;base64, iVBORw0KGgoAAAANSUhEUgAAAOoAAACvCAYAAADzAUKRAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAhOAAAITgBRZYxYAAAABxpRE9UAAAAAgAAAAAAAABYAAAAKAAAAFgAAABXAAALDtD\/AHsAAAraSURBVHgB7F0JcFxlHV\/BIhY5PQCLo4CDAsKMyDgjCgoWjxEUxQNHqvXCq+OJTDlGooxNdrdSadWapuTthlA7m90tpZ1KasLmXdtMyVAqpPvebqhllAptoS2UlrbQ9fd\/2SMLaXbT7OZ9Nb\/O\/Pu2fS\/vbX7H9\/\/uFwhM0p+mpvwxd8fSM8JJ+wuhZPq3wbi9JJSwlyNiUyOsaDhht4QT1neDyXXn5\/P5N0wS9HwMEagNgQUJ48xw3PoqDHkXxNoFo6bw+RHE44gnpkTE7Q343U38ritRSN3jGTZmvU8KsNpQ5FVEoEEINKVSb\/RMmkj\/vGDKl3HMMzwMng3F03eHEusuaW0dmNYgCnhbIlAdgVBs\/RnBhLUAxnwGsZ8GrSikXgUe+0IJ6\/6WpPWxpljqLdUR5RVEoM4INMfS75W2KMT4FA1aYdDX1ih2BhP23ySz1pkC3o4IVEcA5pyN2EGTjmnSomlfQDV4Ljra3lEdWV5BBOqAgLRLwzH97HAivYgmrcmkYtb9XkdT3L6+DhTwFkSgOgJNWup4VOVmQXzraNSajXqogFWwOsK8ggjUAQHpFIHo5iOep1FrNupwFThpLwuutE6sAw28BREYG4GFnf0nwaCdNOk4TYphK9REVrfErQubYoPHjY0yzxKBCSLQEhs4OZS0u2nU8RsVmD2M4awrOVQzQRHyx6sjsGBF6hRkBp1GHb9RBbeWePrTrP5W1xmvmCACYtTCVLni0AOPtc\/GYkadoP744zUiQKOOP5OOqH30zk\/YV4Q7uk+oEW5eRgSODIHXGFWmyf0\/RHH4pLG1g6TdE+qyLm+0UWXlDqP+GByZY3z6KTEq5q9ahSyxC8dd6Fza3ZCQezc+XsAzMCfXbrhZJ6vXNxaLHSs9y7IYgFE\/DJRfCSWlc9OqgemhFfa5EPRszPEdxFGyz7ZCbMexnvGcZ\/xEek+o4WG\/hO9+ANFwo+J3cmQJHJ51B+IW9ADfWu9AIXqbzMHGzLF5eMbvGRPHQLD08PTWWVtzwnHzWnQIvtOnXHn4xzavNk8NJq2rg4n0UhC\/BYEsJCaydzYmvHsfxL0bWxXl\/Ynv+DWwN4S1xygMb25OmOdgs4Q3H945k3hGSg6Y8iaYpg8hVcRXENIulaOYqREh96eIiIGKGpCal6y7lgUpnVho8RFfJ7B41V3sToB21SyvBBk2qYrA8TvR0H5pQKbRxoNd6U9OYu6sfJRMvkdpcRWy6YP4Mn4BwecS+6NAA9gvK2l\/wJfMKu1SGLQNsZdGZUFFDYyhARn1iFt\/Qnv1tMp01+B\/eWtOE+tmjujdPQpKtTGAZFYifw3WAGbr5cJx+0YZvmywPcu3b3kgfVFhGEH2QiLJxIAaqKIBGPVFeKU31GV\/quykBn9CJr0GbdMBPFh6eUkSMaAGatPAwVDS+kWD7Vm+fUuX\/oNg3DqEyDOIATVQuwaau4zOcLz\/4rp2LDXl88e0DgxMW7gm9yYJfJ4uA7hoGDeHk+k8gxhQA+PTAAo1955V6+e29Tx+uqQ+8VVscPA48Vo5FY7zk5bacMoSPXPZkr7M9zXTvTOqZ1uW9g7+cfHajY\/8pfuxPIMYUAPj08CfH9pw4K9rN26IGNkFnfbQ7VHd+dm9uvP5xb3ujHHaMxDQUv86vsNyLo3o2ZujppuI6C5u7D6N2B41sy\/ieLBdz+QZxIAaOCINHISHdiC2Rkw3g2MPfNas9WWvjvZk3lqTYSUVR\/ucK+H4lbjBPkSeQQyogcnQQHZAM7KzO+yh6vs7R8zs1zXD7Qcxu0jOZJDDZ1BnJQ0cABabEbdqqcEzUtgj+3XZ9V7LOTFqOF9GKjYIXAk41iZYo\/JDA27UcG\/rTOXOep1RI2bmQxHDSdOkNCk14L8GYNQtUrttHdg6vWTWqJk5D+TMQ2wjSf6TRA7IATSwB2bt1UznM55RY7H8sVHd\/ZbnYMOVOrIfqZ7PJO7UwCga0HS3yTPq\/eY\/T40a2d\/RoCygqAH1NICO3Yg0SwPtRu4StE0XkyT1SCIn5AQaWI0O3m8GZJDVc+0oaZdCoVCoAX81IO1UTDj6VUAzM59ARm0nIf4SQvyJ\/6gaMN21MOucAKaAXYYL2ka9iFmWHRzUgM8acLqRSH\/ENiqF6LMQmUnHTJK6uwZDNN8JRKzchbhw0ZgXU8wUMzXglwZWYcbgjYGInTtXltzQqCzZqQH1NICO3geQUb8SuM\/YdCYcGyJJ6pFETsiJLDOFWa8LLE0PngZByPRBv1I7n0vsqYHDaiDbhRrv5wId3RtPiJjOXTQqCypqQD0NIJsux2YNMwOy5g3p9U6SpB5J5IScIJt2an3u5d58X2y5cgdFQVFQA0pq4D6Mo37UMypm6M8lSUqSxLbbYdtuU4YvLarnPugZFVXfX9KoU4Z4mv\/oMn8bFs5cMFz1NbM\/hVFlZzSSSAyoAbU00NahZ88vZtQfox78Eox6iGZlYUUNqKQBZ7GWyrynmFFvQu\/S8yDoVZKkEkn8LtSju0h2JPSMKpN+AciziFcIDM1BDaijASxxW4g26tsLRnVncc8kdcihUchFWQN49UV\/7qRhoxruDTCqg5P7yxcQLGJBDfivAScsb6\/wjOptvG24G\/GlXvb\/i1Ec5IAaKGsgG5SdQosZ9TqcWI\/YW76AYBELakABDczzTCp\/YdLvNfhCVmGIhuNoao2jkY+pzAcWzJSMKrtxY0vCh2HWPQqUIBTmVBYmf\/cK\/Zc24C5k1JnYknANTCrvPq24kP8mHtSArxr4TSmjYvXMFbKSHITsJim+ksJCkomiUgNY2VYyamHL0GUwKd+JSqFUCoV4+IyHc0vJqBhD\/TBMqhWmEfr8xZjRWKuhBooawBvIf102Kta7oY3aipPPFS\/gkWKhBvzXgCxBLRvVcC4GKbK37w6S4z855IAcFDSwH7XdOSWjyno3DM\/Mx8ntFAlFQg0ooQFZcroXNd2flIwqm3AX3pEqK2jYRiUG1ID\/GhCj7kYb9Ycloy61N707YmZvR1Z9hkZlQUUNKKEBWXK6DVXf75WMGk27M6R3CSf+S5KUIIkZzf+M5jcHsjXSViTQb5eM2taz+XT8h+yb9DSNSqNSA0poAEZ1nvLeNl506rKU+zapC6Ph+h+SpARJfpfmfL7\/Gf0AvDgU0Z1vFH0aaP3HkydLisWJf9OoNCo1oIQGZG34pqjufq1s1IGt0\/GOixu8VOt\/ScLSnBxQA4a7Dx1Jj2G24PUjjDowDTMgvogTW1iaKlGaUqgsrPbBi49qevZLJaPKh6jlfhYnNtOoNCo1oIQGsNuKk9bM3LUVRm3XnatA0JMkSQmSmFGZUfdohtMnCbTCqLImFSYdolFpVGpACQ2MblS0T2WpW44kKUESMyozquy28nfvJcYjU6qmZy7CCZdGpVGpASU0ILutrOgwch8f6VPsRJg5D1lVNuFmaU4MqAH\/NTC6UdvN7Dkw6RM0KgsqakAJDezC3Ibl6Pkdftt4Ma126M7ZIOhRkqQEScxo\/mc0vznYCaNGpO+o6FHvKO9gxIl+GpVGpQZU0IC8BtVp77CcSyuM6q1JNVydJKlAEr8DdYj9y7CPWRT7mVUYtV0fehdW0DxEgGgSakAJDexAtXehjMZUGLUzlTsLS2oeJElKkOR3+4jP97+NvB1N0T\/gJcYXVBhVdnnAvkkxGFXWwZEoYkAN+KuBbVg5E9RS7vvFqP8DAAD\/\/3kp1CgAAAntSURBVO2dCWwUVRzGRVEUxJt44n1Go4lnvCLxDBrRqHgHJUbFO14kKF6JiQeJB2qwCju7S5VYNQZFFMEsM1MqCcVYcLvzZluKIigiR8ATxfX7r9tkHtuZmridt818TSadN912t+\/7fu\/\/5r0377\/NNpWvac3efmnHb0w76lccJR6sA3rAqAdWp23vactuP6Kb0fL36U77vmnHS0GcjRTIqEBsJBkoSmlX\/ZC2\/YlWrnCwBqqVy+8DUKcA0rUElaDSA8Y98D00mJBt7jxQA\/XNecv2Rtf3xTLJbNEY1egB0x4AqN74xlzxAA3UlFMcZtn+s6B4BVtT462paZPw\/c03VCstx79HAqgG6ts5tZdlqycBaRdBJaj0gGEP2Oo7gDpOuNRAzcwr7Jlx1CPo\/voUybBI5ltzRlTTGgDUtOvfNrUlv4cGqlwAwQ\/jHrVAUAkqPWDcA9+CxTGYNh2qgfqWu2R3EHwvBFpCkYyLxIhmOqIZf3\/vG8tR1za0rhqsgWrlunbDD27FSNNigkpQ6QHTHgCorjcaXO6ogdowt3NXCbWAdSFFMi0S3z\/pHsR40XKweHkulxuogdq4sLgLlixdjQpyk15J\/P\/ZUNSBB5ZlmtVIDVIpNOXyOwvBGPXN1cGH5D2a8XskwmqYg2UZ1z+\/Z1BtdTE+3FzDH5CQElJ6wFGdllsYUQWqjC4B0PPStppNUBlN6AHjHuhI2YUzqkBtalmxE0Z8z0TXdyZFMi4SI0riexVYeOQWTqoCVYaBs83eyYD1PYJKUOkB0x7wfay\/P7EK1Mmzi4PSzcVjIdAMimRaJL4\/PaiU8FgFalM+v0PGLRyJCprOSiIo9IBhD2Apb8r1D60CtaG1dXt5mhwCWRTJsEiJvz9j\/cua+x5BlRUQsh0LVkS8QVBpFHrAuAfasrZ3SFVEfbJU2lYW5uOZ1NcoknGROOqb8F6FLOWt2i9JqC2VSgPKc6m29zJBJaj0gGEP2OqLHkHthhXTM5MokmGREh5N6D\/4z1XO1AXtB1V1fbsvZFz1DCuKoNIDhj3gqs9Sdsfwbi6rvsumvxTJsEiMqLxHd9QnkaAioj5BUAkqPWDYA7b3YdVWocGw+u8GZ4Y\/JCMKI0qyPfCnLOXNtKj9g2xq53jBeLambKjoAaMe+B31P0PyQWlwBgt4wf0UyahIjKbJjqbQ3\/sFPdtsJKiyOzdAReilWVkH9IAhDyBRm5eSlYLBIKqd4wV3CNGGPiCjCRtIeqCcqM2bIonbNDiDBSxdwpah\/jqAuoWwMqLQA0Y88COmSV+uyjsTBBWbcI+FOJLy7S+KZEQkRhT2KlZbrv9SJKgZx7sRgC7DsZmgElR6wIgHVsgKQcmwGAyi2nnGVtdAnHYcf1AkIyIxojKidoG9p6oyuQVJxf3plXhRG47fCCpBpQeMeKBLUqBGglrehNtWiyDQrxTJiEiMqImPqOXUpxMkFWowiGrniKiXAFCkteAUDRsqNlSGPJDHPeoDVblRg6RmncJFWBXxOT7gJkMfkhEl8REl4Q2E6y\/N2N59kaCmbO9cADoLB1ZHJLzC+P+z0TTgAQTKrxBR75StkYJBVDu35quz0f19F5BuIKhsqOgBAx6QMSLbu0VyFmtwBguS7wLivI1jPUUyIJKBFpw615fOsrEZpklvkpzFQTa1c4TdUyGchWMtBawvAalHQvTAxmay8EhyFmtwBguS7wIpyV+HKX6iMRJiDEbx+roXx8ZmYHA0HnMbGmRTOwfJx8uCYEC6hqASVHogfg+UZ11sb5QkF9fgDBasnDrasv1nIdBqihS\/SKxz1rmAarnFSyNBTS8oHlbZ4EyeoKmvLgE\/D\/VIgAewecOnabt4YXZO25BgENXOZdNfADoBxyqCyoaKHjDgAexAKNOkklxcgzNYkC0K07b\/EARaSZEMiJSAiEFf9eIrgJptVmdFgirbP1T2TVrBCu2lQgkVu+J944EPsq5\/WiSo8mhNxvZvB6TfElSCSg8Y8ICr3pnmqhMmzy4OCvZ2tXNZDYEENWMw8rScIhkQqW9aaEa+\/lWvM7K59uMiQZVwi7nUqwCpbMdCgVkH9EDsHvAbZZq0KZ\/fQYuiwYL8EKBeBkg7CSobKnogfg9grW865fqHNrS2bh9kUzuXzOOZZjUSAnVQpPhFYp2zzjFGNE1mX3K53EANzq0LlWdSizQNTUMPxO8BjA+9IbMvvYIqczgQSFGk+EVinbPOsQ3SFJl9aWoqbbd1ENXK8gQNRn4LNA1NQw\/E7wFE1MmyzlduQzUwty5kbf8YCJSnSPGLxDpnnWOHlRdlaqZUKg3Ymk2tPD3XcTgM8zVNQ9PQA0Y88ILMvvQKamVh\/hKKZEQkzlvGPm9Zbzr7z2mRM6yQsjuG44Z2MUGtNwH5eRLhSdt7OoxN7Xr5CRrHa0lEpSS+9Sb8defz\/wpqpkXtL0+Z190\/QKjYLU6GBx7XImdYAZsq7QdQPyaojDb0gAEPuP6jYWxq16c77ftCoA8okgGRkhEx2DOI1nmCBmRYQZYvYcHDOwD1T8JKWOmBeD2AjRseDmNTuy4pydH1zUIg5kiNbvkYGVg\/feGB+zUgwwoCKqZnUgD1Z7am8bamrG\/Wt2RyC2NTu461vsOQ8fg1mIZpLRgx+iJi8G+G+2ozerN3a0CGFWTlPiLqJIDKvX3DK5RmY93U2gN\/g7lNuEcdF8amdl1SkmMT7mfStvqOXTF2xeiB2DywBXW9Fjs83KoBGVaQTMeV3fK7KFJsItW6debf638RX0BdI7lRw9jUrkumY\/wCdsv3fYJKUOmB2DzwF+p6Jbq+N2tAhhXKoNrqQfxSO0WKTSRGwP4XAWut2Wbw1omIekMYm9r18t6+troLv9RGUAkqPRCbB\/4o92Jd\/zoNyLCCJFBF6sXrMUy8gCLFJlKtW2f+vf4XoWWB0Zdg74owNrXrDa2rBlvz\/QvwS58QVIJKD8TmgY3CXMb1z9eADCvI7mcy8ov1vq9SpNhEYgTsfxGw1pqtQibFiVnbOySMzR6vp11\/LED9EYcMG9f6Q\/HvsU7pgaAHbLVI8qL2CGPURaS2OB6AvlKBlZUarFSe0w+19cBK8Pa8PGIaxWSPP5Nd0DLzi6djJGomYOUjb7UVhkZnfXZ7YIvleq9jEPeoyMRQPVJauZid0zZERqEA6iwcfOyN5uo2F7\/XxgtYT+\/PtNzCiCgOe\/2ZRNXuxFFYVvg+YF2PgyKxDuiB\/+0Bfx1YsnBfekqve\/j2SmrlBY0Li7tkneI5luM9hidr5uANJNvbBhwcaPrfgrHhg4+SAL7cPq7HIO3Sf28nvfHZZu\/kyITF\/xXQ4OsksspiCLzRdXjDj3BIsmPeuybDZEkAqS\/\/R3mE7XdhRtIqYpngKFmqG+Qr6vwfrbb0TT3rO34AAAAASUVORK5CYII=\"},{\"type\":\"file\",\"name\":\"MP4_HPL40_30fps_channel_id_51.mp4\",\"thumb\":\"thumb?path=\/var\/mobile\/Containers\/Data\/Application\/EA1E05D9-28D5-4E74-A0A1-BD8C82E30698\/Library\/Caches\/thumbnails\/2016Jul15162406432_1144108930.png\"},{\"type\":\"file\",\"name\":\"Now You See Me 2.pxl\",\"thumb\":\"thumb?path=\/var\/mobile\/Containers\/Data\/Application\/EA1E05D9-28D5-4E74-A0A1-BD8C82E30698\/Library\/Caches\/thumbnails\/2016Jul15162406218_984943658.png\"},{\"type\":\"file\",\"name\":\"Star Trek Beyond.pxl\",\"thumb\":\"thumb?path=\/var\/mobile\/Containers\/Data\/Application\/EA1E05D9-28D5-4E74-A0A1-BD8C82E30698\/Library\/Caches\/thumbnails\/2016Jul15162405721_1622650073.png\"},{\"type\":\"file\",\"name\":\"The Legend of Tarzan.pxl\",\"thumb\":\"thumb?path=\/var\/mobile\/Containers\/Data\/Application\/EA1E05D9-28D5-4E74-A0A1-BD8C82E30698\/Library\/Caches\/thumbnails\/2016Jul15162405266_282475249.png\"}]}";
            return jsonObject;
    },

}

var explorer = null;
$(function() {
    explorer = new Explorer();
    explorer.loadItemsForPath(null);

    $(window).bind('popstate', function(e) {
        explorer.loadItemsForPath(null);
    });
  
  
  var customTemplate = "<div id=\"preview-template\" style=\"display:none\"><div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n <div class=\"dz-filename\"><span data-dz-name></span></div>\n<div class=\"cancel-upload-btn\"><a data-dz-remove=\"\" href=\"javascript:undefined;\" class=\"cancelUpload\"><span>x</span></a></div> <div class=\"dz-size\"><span data-dz-size></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div></div>";
  
  $("body").append(customTemplate);
 


    // Uploader
    $(".dropzone").dropzone({
        url: "upload",
        paramName: "file", // The name that will be used to transfer the file
        dictDefaultMessage: 'Drop files to upload <span>or CLICK</span>',
        maxFilesize: 20*1024, // MB
        parallelUploads: 2,
        createImageThumbnails: false,
        previewTemplate: document.getElementById('preview-template').innerHTML,
                            
               init: function() {
            
            this.on("success", function() {
                explorer.loadItemsForPath(null);
                
            });
            
            this.on("complete", function() {
//           Rearranging the Cancel upload button and the file size
                $(".dz-complete").find(".cancel-upload-btn").css("display", "none");
            });

            this.on("canceled", function(file) {
                // Make a call that the uploading of a file is canceled
//                explorer.uploadCanceled(file.name); // No need to call this because its already called from the "error" function
            });
                            
            this.on("error", function(file) {
                // Make a call that the uploading of a file is canceled
                explorer.uploadCanceled(file.name);
            });
                            
            this.on("addedfile", function(file) {
                // Make a call that the uploading of a file is canceled
                    
                    $('.dropzone').css('height', 'auto');
                    
                    if($('.dropzone').height() > $('#mCSB_2').height() ) {
                        $('#mCSB_2_container').css('height', 'auto');
                    }
                    else{
                        $('.dropzone').css('height', '100%');
                    }

            });
        }
    });

    // Scroll
    $(".items-container").mCustomScrollbar({
        theme: "minimal-dark",
        scrollbarPosition: "inside",
        autoDraggerLength: false,
    });

    // Scroll
    $(".dropzone-container").mCustomScrollbar({
        theme: "minimal-dark",
        scrollbarPosition: "inside",
        autoDraggerLength: false,
    });

});


