/*!
* otp-input v1.0
* Released under the MIT License.
*/

(function($) {
    "use strict";
    $.fn.otpInput = function($config) {
        let $this = $(this);

        $this.addClass("otp-input");

        if ($config !== undefined) {
            $config.count = $config.count !== undefined ? $config.count : 6;
            $config.isNumber = $config.isNumber !== undefined ? $config.isNumber : false;
            $config.name = $config.name !== undefined ? $config.name : 'otp';
        }else{
            $config.count = 6;
            $config.isNumber = false;
            $config.name = 'otp';
        }

        let parentWidth = (50 * $config.count) - 10;

        for (let i = 0; i < $config.count; i++) {
            $this.append(`<input id="otpInput${i}" ${ i >= 0 && i < $config.count - 1 ? "data-next='otpInput" + (i+1) + "'" : "" } ${ i <= $config.count && i > 0 ? "data-previous='otpInput" + (i-1) + "'" : "" } type="${$config.isNumber ? "number":"text"}">`);
        }

        $this.append(`<input name="${$config.name}" id="${$config.name}" type="hidden">`);

        $this.find('input:not([type="hidden"])').each(function() {
            $(this).on('keyup', function(e) {
                let key = e.keyCode;
                let keyStatu = true;

                if ($config.isNumber) {
                    keyStatu = (key == 8 || key == 9 || key == 13 || key == 46 || key == 110 || key == 190 || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
                }

                if (keyStatu) {
                    if(key === 8 || key === 37) {
                        var prev = $this.find('input#' + $(this).data('previous'));                        
                        if(prev.length) {
                            $(prev).select();
                        }
                    } else if((key >= 48 && key <= 57) || (key >= 65 && key <= 90) || (key >= 96 && key <= 105) || key === 39) {
                        var next = $this.find('input#' + $(this).data('next'));
                        if(next.length) {
                            $(next).select();
                        } else {
                            let val = "";
                            let completeStatu = false;
                            $.when($this.find('input:not([type="hidden"])').each(function(){
                                val += $(this).val();
                            })).then(function(){
                                $this.find('input[type="hidden"]').val(val);
                                completeStatu = val.length === $config.count;
                                if (completeStatu) {
                                    $this.addClass("success");
                                }else{
                                    $this.addClass("error");
                                }
                                if ($config.complete !== undefined) {
                                    $config.complete(val, completeStatu);
                                }
                            });
                        }
                    }
                }

            });
            $(this).on('input', function(e) {
                if ($(this).val().length > 1) {
                    $(this).val($(this).val().slice(0,1));
                }
            });
        });

        $("head").append(`<style>.otp-input{display:flex;align-items:center;justify-content:center;max-width:${parentWidth}px;margin:auto}.otp-input input{width:100%;height:40px;border:2px solid transparent;outline:0;box-shadow:none;text-align:center;padding:0 5px;color:#000;background:#e1e1e1;border-radius:5px;font-size:16px;font-weight:600}.otp-input input+input{margin-left:10px}.otp-input input:focus,.otp-input input:hover{border-color:#000}.otp-input input::-webkit-inner-spin-button,.otp-input input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.otp-input input[type=number]{-moz-appearance:textfield}.otp-input.error input { border-color: red; } .otp-input.success input { border-color: #009432; }</style>`);

    }
})(jQuery);