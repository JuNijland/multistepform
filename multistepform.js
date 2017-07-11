/**
 * @author Jurgen Nijland
 */

$.fn.multistepform = function(options) {
    'use strict';

    var defaults = {
        'onLastStep': function() {},
        'onFinish': function() { return true; },
        'onNext': function() { return true; },
        'onBack': function() { return true; }
    };

    var settings = $.extend( {}, defaults, options );

    return this.each(function(idx, form) {
        var $form = $(form);
        var $steps = $form.find('.step');
        var $back = $form.find('.step-back');
        var $next = $form.find('.step-next');
        var $finish = $form.find('.step-finish');
        var $progressBar = $form.find('.progress-bar');
        var $step = 0;
        var $maxSteps = $steps.length;


        function disableButtons() {
            $back.prop('disabled', ($step <= 0));
            $next.toggle($step < $steps.length-1);
            $finish.toggle($step === $steps.length-1);
        }

        function goBack() {
            if ($step > 0) {
                $($steps[$step]).hide();
                $($steps[--$step]).show();
                update()
            }
        }

        function goNext() {
            if ($step < $maxSteps) {
                $($steps[$step]).hide();
                $($steps[++$step]).show();
                update()
            }
        }


        function updateProgressBar() {
            var width = 100 * (($step+1)/$maxSteps);
            $progressBar.width(width + '%');
            $progressBar.text('Step ' + ($step + 1) + ' of ' + $maxSteps);
        }

        function update() {
            var inputElements = $($steps[$step]).find("input");
            if (inputElements.length > 0) {
                inputElements.first().focus();
            }
            disableButtons();
            updateProgressBar();
            if ($step === $maxSteps-1) {
                settings.onLastStep.call(this);
            }
        }

        function init() {
            $steps.hide();
            $($steps[0]).show();

            $back.click(function() {
                if (settings.onBack.call(this)) {
                    goBack();
                }
            });
            $next.click(function() {
                if (settings.onNext.call(this)) {
                    goNext();
                }
            });
            $finish.click(function() {
                settings.onFinish.call(this);
            });
            update();
        }
        init();

        $(document).on("keypress", $form, function(event) {
            if (event.keyCode === 13) {
                if ($step < $maxSteps - 1) {
                    console.log('kut');
                    event.preventDefault();
                    $next.click();
                } else {
                    $finish.click();
                }
            }
        });
    });

};