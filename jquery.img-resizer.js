var IMG_RESIZER__HTML =
    '<div id="img_resizer_page_cover" class="irc_cover" style="width: 100%;position: absolute; left: 0; top: 0; z-index: 9998; background-color: rgba(0, 0, 0, 0.25); display: none;"></div>' +
    '<div id="img_resizer_cont" class="irc_cont" style="box-sizing: border-box; padding: 5px; position: fixed; left: 200px; top: 50px; z-index: 9998; background-color: #ffffff; display: none;border-radius: 5px; box-shadow: 0 9px 23px rgba(0, 0, 0, 0.09), 0 5px 5px rgba(0, 0, 0, 0.06);">' +
    '   <div class="irc_header" style="height: 25px; position: relative; width: 100%; display: flex; flex-direction: row;">' +
    '       <div class="ir_upload_wrapper" style="height: 25px; position: relative;  min-width: 66px; overflow: hidden; display: inline-flex;">' +
    '           <input type="file" id="img_resizer_input_file" style="opacity: 0; flex-basis: 66px; height: auto; position: absolute; left: 0px; left: -150px\9; top: 0px; z-index: 997; cursor: pointer;">' +
    '           <a href="#" style="border-radius: 3px; font-size: 12px; color : #0f0699; padding: 0px 5px; text-decoration: none; position: absolute; left: 0px; top: 0px; z-index: 996; line-height: 25px;">选择图片:</a>' +
    '       </div>' +
    '       <div class="ir_upload_info" style="display: inline-flex; flex-grow: 1; height: 25px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; padding-right: 50px;">' +
    '           <span class="ir_upload_file_hint" style="line-height: 25px; font-size: 12px; color : #0f0699; "></span>' +
    '       </div>' +
    '       <div class="ir_confirm_btn" style="display: inline-flex; flex-basis: 66px; height: 25px; min-width: 66px;">' +
    '           <button style="width: 100%;">确认</button>' +
    '       </div>' +
    '   </div>' +
    '   <div class="img_workarea" style="box-sizing: border-box; height: 575px; width: 500px; border: 2px solid #dddddd; position: relative; overflow: hidden; background: #fff;">' +
    '       <div class="img_wrapper" style="position: absolute; width: 100%; height: 100%; z-index: 991; left: 0px; top: 0px;"></div>' +
    '       <div class="img_smooth_border" style="box-sizing: border-box; position: absolute; width: 100%; height: 100%; border: 20px solid rgba(255, 255, 255, 0.75); z-index: 995;"></div>' +
    '       <div class="img_win" style="box-sizing: border-box; position: absolute; border: 2px dashed #9e9e9e; z-index: 999; cursor: move;"></div>' +
    '   </div>' +
    '</div>';
var DEFAULT_IMG_WIDTH = 800;
var DEFAULT_IMG_HEIGHT = 600;
var DEFAULT_IMG_WAPPER_BORDER_WIDTH = 50;

(function(factory){
    if(typeof define === "function" && define.amd){
        define(["jquery"],factory);
    }else if(typeof module!=="undefined" && module.exports){
        module.exports=factory;
    }else{
        factory(jQuery);
    }
}(function ($) {
    $.initImgResizer = function (options) {
        window.ImaResizer = {
            inited : false,
            options : options,
            $imgPageCover : 0,
            $imgCont : 0,
            $imgInputCtrl : 0,
            $irUploadWrapper : 0,
            $imgWrapper : 0,
            $fileNameHint : 0,
            $confirmBtn : 0,
            fileReader : new FileReader(),
            img : 0,
            imgWidth : 0,
            imgHeight : 0,
            imgWinWidth : 0,
            imgWinHeight : 0,
            isVector : false,
            isImageMoving : false,
            oldPosition : 0,
            //各种参数，各种属性
            doInit : function () {
                $("body").append(IMG_RESIZER__HTML);
                this.$imgPageCover = $("#img_resizer_page_cover");
                this.$imgCont = $("#img_resizer_cont");
                this.$imgInputCtrl = $("#img_resizer_input_file");
                this.$imgWrapper = this.$imgCont.find(".img_wrapper");
                this.$irUploadWrapper = this.$imgCont.find(".ir_upload_wrapper");
                this.$fileNameHint = this.$imgCont.find(".ir_upload_file_hint");
                this.$confirmBtn = this.$imgCont.find(".ir_confirm_btn button ");


                var winWidth = $(document).width();
                var winHeight = $(document).height();
                var scrrenHeight = $(window).height();
                this.$imgPageCover.height(winHeight);

                var imgWidth = (options.imgWidth ? options.imgWidth : DEFAULT_IMG_WIDTH);
                var imgHeight = (options.imgHeight ? options.imgHeight : DEFAULT_IMG_HEIGHT);
                this.imgWinWidth = imgWidth;
                this.imgWinHeight = imgHeight;

                var imgContWidth = imgWidth + 2 * DEFAULT_IMG_WAPPER_BORDER_WIDTH + 8;
                var imgContHeight = imgHeight + 2 * DEFAULT_IMG_WAPPER_BORDER_WIDTH + 8;

                var bestWidth = Math.floor(winWidth * 2 / 3);
                var bestHeight = Math.floor(scrrenHeight * 2 / 3);

                var zoom = 0;
                var zoom1 = 0;
                var zoom2 = 0;

                if (imgContWidth > bestWidth) {
                    zoom1 = Math.floor(bestWidth / imgContWidth * 1000000) / 10000;
                }
                if (imgContHeight > bestHeight) {
                    zoom2 = Math.floor(bestHeight / imgContHeight * 1000000) / 10000;
                }
                if (zoom1 || zoom2) {
                    zoom = (zoom1 < zoom2 ? zoom1 : zoom2);

                    if (zoom1 < zoom2) {
                        imgContWidth = bestWidth;
                        imgContHeight = Math.floor(imgContHeight * zoom1 / 100);
                    } else {
                        imgContHeight = bestHeight;
                        imgContWidth = Math.floor(imgContWidth * zoom2 / 100);
                    }
                }
                var _this = this;
                this.$irUploadWrapper.on("mouseover", function () {
                    $(this).find("a").css({
                        color : "#fff",
                        backgroundColor : "#0f0699"
                    });
                }).on("mouseout", function () {
                    $(this).find("a").css({
                        color : "#0f0699",
                        backgroundColor : "#fff"
                    });
                });
                this.$imgPageCover.on("click", function () {
                    _this.hide();
                });
                this.$imgCont.css({
                    width : (imgContWidth + 10) + "px",
                    height : (imgContHeight + 35) + "px",
                    left : (winWidth - imgContWidth - 10) / 2 + "px",
                    top : (scrrenHeight - imgContHeight - 35) / 2 + "px"
                });
                this.$imgCont.find(".img_workarea").css({
                    width : (imgWidth + 8 + 2 * DEFAULT_IMG_WAPPER_BORDER_WIDTH) + "px",
                    height : (imgHeight + 8 + 2 * DEFAULT_IMG_WAPPER_BORDER_WIDTH) + "px",
                    zoom : zoom + "%"
                });
                this.$imgCont.find(".img_smooth_border").css("borderWidth", DEFAULT_IMG_WAPPER_BORDER_WIDTH + "px");
                this.$imgCont.find(".img_win").css({
                    width : (imgWidth + 4) + "px",
                    height : (imgHeight + 4) + "px",
                    left : DEFAULT_IMG_WAPPER_BORDER_WIDTH + "px",
                    top : DEFAULT_IMG_WAPPER_BORDER_WIDTH + "px"
                }).on("mousedown", function (event) {
                    if (!_this.$fileNameHint.html()) {
                        _this.isImageMoving = false;
                        return;
                    }
                    _this.isImageMoving = true;
                    _this.oldPosition = (_this.isVector ? event.pageY : event.pageX);
                    console.log("Start Moving!");
                });
                this.$confirmBtn.on("click", function (event) {
                    if (!_this.options.onConfirm) {
                        alert("No call back function specified! Pls check your program!");
                        return;
                    }
                    if (!_this.$fileNameHint.html()) {
                        alert("No image selected!");
                        return;
                    }
                    _this.isGenerating = true;
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    canvas.width = _this.imgWinWidth;
                    canvas.height = _this.imgWinHeight;
                    // 核心JS就这个
                    var positionAttrName = (_this.isVector ? "top" : "left");
                    var oldImagePosition = _this.img.position()[positionAttrName];
                    var imgLeft = (_this.isVector ? 0 : -(oldImagePosition - DEFAULT_IMG_WAPPER_BORDER_WIDTH - 2));
                    var imgTop = (_this.isVector ? -(oldImagePosition - DEFAULT_IMG_WAPPER_BORDER_WIDTH - 2) : 0);
                    console.log("【Cur area】", oldImagePosition + "->" + imgLeft + "->" + imgTop);
                    context.drawImage(_this.img[0], imgLeft, imgTop, _this.imgWidth, _this.imgHeight, 0, 0, _this.imgWidth, _this.imgHeight);
                    _this.hide();
                    _this.options.onConfirm(canvas.toDataURL("image/png"));
                });
                this.$imgInputCtrl.on("change", function (event) {
                    if (!this.value)
                        return;
                    _this.$fileNameHint.html(this.value);
                    var file = event.target.files[0];
                    var imageType = /image.*/;
                    if (imageType.test(file.type)) {
                        _this.fileReader.onload = function () {
                            _this.$imgWrapper.empty();
                            var img = new Image();
                            img.src = _this.fileReader.result;
                            img.onload = function () {
                                var imgWidth = this.width;
                                var imgHeight = this.height;
                                var imgScale = imgWidth / imgHeight;
                                var bannerScale = _this.imgWinWidth / _this.imgWinHeight;
                                // 纵向长，横向短
                                _this.isVector = imgScale < bannerScale;

                                console.log("【Img Size】", imgWidth + "->" + imgHeight);
                                console.log("【Img Scale】", imgScale + "->" + bannerScale);

                                if (!_this.isVector) {
                                    imgHeight = _this.imgWinHeight;
                                    imgWidth = Math.floor(imgHeight * imgScale);
                                } else {
                                    imgWidth = _this.imgWinWidth;
                                    imgHeight = Math.floor(imgWidth / imgScale);
                                }

                                _this.imgWidth = imgWidth;
                                _this.imgHeight = imgHeight;


                                var canvas = document.createElement('canvas');
                                var context = canvas.getContext('2d');
                                canvas.width = imgWidth;
                                canvas.height = imgHeight;
                                context.drawImage(img, 0, 0, imgWidth, imgHeight);
                                var newImage = new Image();
                                newImage.src = canvas.toDataURL("image/png");
                                newImage.onload = function () {
                                    _this.$imgWrapper.append($(newImage));
                                    _this.img = _this.$imgWrapper.find("img");
                                    _this.img.width(imgWidth).height(imgHeight).css({
                                        position : "absolute",
                                        top : DEFAULT_IMG_WAPPER_BORDER_WIDTH + 2,
                                        left : DEFAULT_IMG_WAPPER_BORDER_WIDTH + 2
                                    });
                                };
                            };
                        };
                    }
                    _this.fileReader.readAsDataURL(file);
                });

                window.onmouseup = stopMoving;
                window.ondragend = stopMoving;

                function stopMoving() {
                    _this.isImageMoving = false;
                }

                this.inited = true;

                $("body").on("mousemove", function(event) {
                    if (!_this.$fileNameHint.html()) {
                        _this.isImageMoving = false;
                        return;
                    }
                    if (_this.isImageMoving) {
                        var positionAttrName = (_this.isVector ? "top" : "left");
                        var oldImagePosition = _this.img.position()[positionAttrName];
                        var newPosition = (_this.isVector ? event.pageY : event.pageX);
                        if (newPosition == _this.oldPosition) {
                            return;
                        }
                        if (_this.isVector) {
                            if (_this.oldPosition >= newPosition) {
                                if (_this.imgHeight + oldImagePosition <= _this.imgWinHeight + DEFAULT_IMG_WAPPER_BORDER_WIDTH + 4) {
                                    _this.img.css(positionAttrName, -(_this.imgHeight - _this.imgWinHeight - DEFAULT_IMG_WAPPER_BORDER_WIDTH - 2));
                                    return;
                                }
                            } else {
                                if (oldImagePosition >= DEFAULT_IMG_WAPPER_BORDER_WIDTH -2 ) {
                                    _this.img.css(positionAttrName, DEFAULT_IMG_WAPPER_BORDER_WIDTH + 2);
                                    return;
                                }
                            }
                        } else {
                            if (_this.oldPosition >= newPosition) {
                                if (_this.imgWidth + oldImagePosition <= _this.imgWinWidth + DEFAULT_IMG_WAPPER_BORDER_WIDTH + 4) {
                                    _this.img.css(positionAttrName, -(_this.imgWidth - _this.imgWinWidth - DEFAULT_IMG_WAPPER_BORDER_WIDTH - 2));
                                    return;
                                }
                            } else {
                                if (oldImagePosition >= DEFAULT_IMG_WAPPER_BORDER_WIDTH - 2) {
                                    $vue.img.css(positionAttrName, DEFAULT_IMG_WAPPER_BORDER_WIDTH + 2);
                                    return;
                                }
                            }
                        }

                        var moveSpace = (newPosition - _this.oldPosition > 0 ? 4 : -4);
                        _this.oldPosition = newPosition;
                        _this.img.css(positionAttrName, oldImagePosition + moveSpace);
                    }
                });
            },
            show : function () {
                if (!this.inited) this.doInit();
                this.$imgPageCover.show();
                this.$imgCont.show();
            },
            hide : function () {
                if (!this.inited) this.doInit();
                this.$imgPageCover.hide();
                this.$imgCont.hide();
            }
        };
        window.ImaResizer.doInit();
        return window.ImaResizer;
    };
}));