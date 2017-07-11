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
        let $form = $(form);
        let $steps = $form.find('.step');
        let $back = $form.find('.step-back');
        let $next = $form.find('.step-next');
        let $finish = $form.find('.step-finish');
        let $progressBar = $form.find('.progress-bar');
        let $step = 0;
        let $maxSteps = $steps.length;


        function disableButtons() {
            $back.prop('disabled', ($step <= 0));
            $next.prop('disabled', ($step >= $steps.length-1));
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
            let width = 100 * (($step+1)/$maxSteps);
            $progressBar.width(width + '%');
            $progressBar.text('Step ' + ($step + 1) + ' of ' + $maxSteps);
        }

        function update() {
            disableButtons();
            updateProgressBar();
            if ($step === $maxSteps-1) {
                settings.onLastStep.call(this);
            }
        }

        function init() {
            $steps.hide();
            console.log($steps);
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
    });

};