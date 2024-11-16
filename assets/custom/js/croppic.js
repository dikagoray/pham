/*
 * CROPPIC
 * dependancy: jQuery
 * author: Ognjen "Zmaj Džedaj" Božičković and Mat Steinlin
 */

(function (window, document) {

    Croppic = function (id, options) {

        var that = this;
        that.id = id;
        that.obj = $('#' + id);
        that.outputDiv = that.obj;

        // DEFAULT OPTIONS
        that.options = {
            uploadUrl: '',
            OutputDisplay: '',
            loaderHtml: '',
            OutputText: '',
            //callbacks
            onBeforeImgUpload: null,
            onAfterImgUpload: null,
            onError: null,
        };

        // OVERWRITE DEFAULT OPTIONS
        for (i in options)
            that.options[i] = options[i];

        // INIT THE WHOLE DAMN THING!!!
        that.init();

    };

    Croppic.prototype = {
        id: '',
        obj: {},
        outputDiv: {},
        img: {},
        defaultImg: {},
        croppedImg: {},
        imgEyecandy: {},
        form: {},
        iframeform: {},
        iframeobj: {},
        modal: {},
        loader: {},
        init: function () {
            var that = this;

            that.bindImgUploadControl();

        },
        bindImgUploadControl: function () {
            
            var that = this;

            that.imgUploadControl = that.outputDiv.find('#' + that.id);
            // CREATE UPLOAD IMG FORM
            var formHtml = '<div class="' + that.id + '_imgUploadDiv"><form class="' + that.id + '_imgUploadForm" style="visibility: hidden;">  <input type="file" name="img" id="' + that.id + '_imgUploadField">  </form></div>';
            that.outputDiv.after(formHtml);
            that.formDiv = $('.' + that.id + '_imgUploadDiv');
            that.form = that.formDiv.find('.' + that.id + '_imgUploadForm');

            // CREATE FALLBACK IE9 IFRAME
            var fileUploadId = that.CreateFallbackIframe();
             
            $('#' + that.id).click(function () {
                if (fileUploadId === "") {
                    that.form.find('input[type="file"]').trigger('click');
                } else {
                    //Trigger iframe file input click, otherwise access restriction error
                    that.iframeform.find('input[type="file"]').trigger('click');
                }
            });

            that.form.find('input[type="file"]').change(function () {

                if (that.options.onBeforeImgUpload)
                    that.options.onBeforeImgUpload.call(that);

                that.showLoader();

                try {
                    // other modern browsers
                    formData = new FormData(that.form[0]);
                } catch (e) {
                    // IE10 MUST have all form items appended as individual form key / value pairs
                    formData = new FormData();
                    formData.append('img', that.form.find("input[type=file]")[0].files[0]);

                }

                $.ajax({
                    url: that.options.uploadUrl,
                    data: formData,
                    context: document.body,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST'
                }).always(function (data) {
                    that.afterUpload(data);
                });
            });

        },
        afterUpload: function (data) {
            
            var that = this;

            response = typeof data == 'object' ? data : jQuery.parseJSON(data);


            if (response.status == 'success') {
                //alert();
                that.imgUrl = response.url;
                var img = $('<img src="image_editor/' + response.url + '"   >')
                if (that.options.OutputDisplay != "") {
                    $('#' + that.options.OutputDisplay).html(img);
                    that.hideLoader();
                }

                if (that.options.OutputText != "") {
                    $('#' + that.options.OutputText).val(response.img);
                }
                if (that.options.onAfterImgUpload)
                    that.options.onAfterImgUpload.call(that);

            }

            if (response.status == 'error') {
                alert(response.message);
                if (that.options.onError)
                    that.options.onError.call(that, response.message);
                that.hideLoader();
                setTimeout(function () {
                    that.reset();
                }, 2000)
            }
        },
        showLoader: function () {
            var that = this;

            $('#' + that.options.OutputDisplay).html(that.options.loaderHtml);
            that.loader = that.obj.find('.loader');

        },
        hideLoader: function () {
            var that = this;
            that.loader.remove();
        },
        reset: function () {
            var that = this;
            that.destroy();

            that.init();
            if (typeof that.options.onReset == 'function')
                that.options.onReset.call(that);
        },
        destroy: function () {
            var that = this;
            if (!$.isEmptyObject(that.loader)) {
                that.loader.remove();
            }
            if (!$.isEmptyObject(that.form)) {
                that.form.remove();
            }
            that.obj.html('');
        },
        isAjaxUploadSupported: function () {
            var input = document.createElement("input");
            input.type = "file";

            return (
                    "multiple" in input &&
                    typeof File != "undefined" &&
                    typeof FormData != "undefined" &&
                    typeof (new XMLHttpRequest()).upload != "undefined");
        },
        CreateFallbackIframe: function () {
            var that = this;

            if (!that.isAjaxUploadSupported()) {

                if (jQuery.isEmptyObject(that.iframeobj)) {
                    var iframe = document.createElement("iframe");
                    iframe.setAttribute("id", that.id + "_upload_iframe");
                    iframe.setAttribute("name", that.id + "_upload_iframe");
                    iframe.setAttribute("width", "0");
                    iframe.setAttribute("height", "0");
                    iframe.setAttribute("border", "0");
                    iframe.setAttribute("src", "javascript:false;");
                    iframe.style.display = "none";
                    document.body.appendChild(iframe);
                } else {
                    iframe = that.iframeobj[0];
                }

                var myContent = '<!DOCTYPE html>'
                        + '<html><head><title>Uploading File</title></head>'
                        + '<body>'
                        + '<form '
                        + 'class="' + that.id + '_upload_iframe_form" '
                        + 'name="' + that.id + '_upload_iframe_form" '
                        + 'action="' + that.options.uploadUrl + '" method="post" '
                        + 'enctype="multipart/form-data" encoding="multipart/form-data" style="display:none;">'
                        + $("#" + that.id + '_imgUploadField')[0].outerHTML
                        + '</form></body></html>';

                iframe.contentWindow.document.open('text/htmlreplace');
                iframe.contentWindow.document.write(myContent);
                iframe.contentWindow.document.close();

                that.iframeobj = $("#" + that.id + "_upload_iframe");
                that.iframeform = that.iframeobj.contents().find("html").find("." + that.id + "_upload_iframe_form");

                that.iframeform.on("change", "input", function () {
                    that.SubmitFallbackIframe(that);
                });
                that.iframeform.find("input")[0].attachEvent("onchange", function () {
                    that.SubmitFallbackIframe(that);
                });

                var eventHandlermyFile = function () {
                    if (iframe.detachEvent)
                        iframe.detachEvent("onload", eventHandlermyFile);
                    else
                        iframe.removeEventListener("load", eventHandlermyFile, false);

                    var response = that.getIframeContentJSON(iframe);

                    if (jQuery.isEmptyObject(that.modal)) {
                        that.afterUpload(response);
                    }
                }

                if (iframe.addEventListener)
                    iframe.addEventListener("load", eventHandlermyFile, true);
                if (iframe.attachEvent)
                    iframe.attachEvent("onload", eventHandlermyFile);

                return "#" + that.id + '_imgUploadField';

            } else {
                return "";
            }

        },
        SubmitFallbackIframe: function (that) {
            that.showLoader();
            if (that.options.processInline && !that.options.uploadUrl) {
                if (that.options.onError) {
                    that.options.onError.call(that, "processInline is not supported by your browser ");
                    that.hideLoader();
                }
            } else {
                if (that.options.onBeforeImgUpload)
                    that.options.onBeforeImgUpload.call(that);
                that.iframeform[0].submit();
            }
        },
        getIframeContentJSON: function (iframe) {
            try {
                var doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document,
                        response;

                var innerHTML = doc.body.innerHTML;
                if (innerHTML.slice(0, 5).toLowerCase() == "<pre>" && innerHTML.slice(-6).toLowerCase() == "</pre>") {
                    innerHTML = doc.body.firstChild.firstChild.nodeValue;
                }
                response = jQuery.parseJSON(innerHTML);
            } catch (err) {
                response = {success: false};
            }

            return response;
        }

    };
})(window, document);
