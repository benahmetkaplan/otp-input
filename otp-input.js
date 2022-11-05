/*!
* otp-input v1.0.1
* Released under the MIT License.
*/
(function($) {
    "use strict";
    $.fn.otpInput = function($config) {
        let $this = $(this);

        $this.addClass("otp-input");
        $this.html("");

        if ($config !== undefined) {
            $config.count = $config.count !== undefined ? $config.count : 6;
            $config.isNumber = $config.isNumber !== undefined ? $config.isNumber : false;
            $config.defaultStyle = $config.defaultStyle !== undefined ? $config.defaultStyle : true;
            $config.inputWarning = $config.inputWarning !== undefined ? $config.inputWarning : true;
            $config.name = $config.name !== undefined ? $config.name : 'otpCode';
        }else{
            $config.count = 6;
            $config.isNumber = false;
            $config.defaultStyle = true;
            $config.inputWarning = true;
            $config.name = 'otpCode';
        }

        for (let i = 0; i < $config.count; i++) {
            $this.append(`<input id="otpInput${i}" ${ i >= 0 && i < $config.count - 1 ? "data-next='otpInput" + (i+1) + "'" : "" } ${ i <= $config.count && i > 0 ? "data-previous='otpInput" + (i-1) + "'" : "" } type="${$config.isNumber ? "number":"text"}">`);
        }

        $this.append(`<input name="${$config.name}" id="${$config.name}" type="hidden">`);

        $this.find('input:not([type="hidden"])').each(function() {
            $(this).on('keyup', function(e) {
                let $keyCode = e.keyCode;
                let $keyStatu = true;

                if ($config.isNumber) {
                    $keyStatu = ($keyCode == 8 || $keyCode == 9 || $keyCode == 13 || $keyCode == 46 || $keyCode == 110 || $keyCode == 190 || ($keyCode >= 35 && $keyCode <= 40) || ($keyCode >= 48 && $keyCode <= 57) || ($keyCode >= 96 && $keyCode <= 105));
                }

                if ($keyStatu) {
                    if($keyCode === 8 || $keyCode === 37) {
                        let $prev = $this.find('input#' + $(this).data('previous'));                        
                        if($prev.length) {
                            $($prev).select();
                        }
                    } else if(($keyCode >= 48 && $keyCode <= 57) || ($keyCode >= 65 && $keyCode <= 90) || ($keyCode >= 96 && $keyCode <= 105) || $keyCode === 39) {
                        let $next = $this.find('input#' + $(this).data('next'));
                        if($next.length) {
                            $($next).select();
                        } else {
                            let $otpValue = "";
                            let $isComplete = false;
                            $.when($this.find('input:not([type="hidden"])').each(function(){
                                if ($(this).val() !== "") {
                                    $otpValue += $(this).val();
                                    if ($config.inputWarning) {
                                        $(this).css("border-color", "#009432");
                                    }
                                }else{
                                    if ($config.inputWarning) {
                                        $(this).css("border-color", "red");
                                    }
                                }
                            })).then(function(){
                                $this.find('input[type="hidden"]').val($otpValue);
                                $isComplete = $otpValue.length === $config.count;
                                if ($isComplete) {
                                    $this.addClass("success");
                                }else{
                                    $this.addClass("error");
                                }
                                if ($config.complete !== undefined) {
                                    $config.complete($otpValue, $isComplete);
                                }
                            });
                        }
                    }
                }

            });
            $(this).on('input', function(e) {
                if ($(this).val().length > 1) {
                    $(this).val($(this).val().substr($(this).val().length - 1));
                }
            });
        });

        if ($config.defaultStyle) {
            let $parentWidth = (50 * $config.count) - 10;
            $("head").append(`<style>.otp-input { max-width:${$parentWidth}px; display: flex; align-items: center; justify-content: center; margin: auto; } .otp-input input { width: 100%; height: 40px; border: 2px solid transparent; outline: 0; box-shadow: none; text-align: center; padding: 0 5px; color: #000; background: #e1e1e1; border-radius: 5px; font-size: 16px; font-weight: 600; transition: all .1s ease-in-out; } .otp-input input+input { margin-left: 10px; } .otp-input input:focus { transform: scale(1.3); } .otp-input input::-webkit-inner-spin-button,.otp-input input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } .otp-input input[type=number] { -moz-appearance: textfield; }</style>`);
        }

    }
})(jQuery);