jQuery.fn.count = function(userOptions) {
	var options = {
		stepTime: 60,
		format: "dd:hh:mm:ss",
		startTime: "00:00:00:00",
		digitImages: 6,
		digitWidth: 67,
		digitHeight: 90,
		timerEnd: function(){},
		image: "digits.png"
	};
	var digits = [], intervals = [];

	var createDigits = function(where) {
		var c = 0;
		for (var i = 0; i < options.startTime.length; i++) {
			if (parseInt(options.startTime[i]) >= 0) {
				elem = $('<div id="cnt_' + c + '" class="cntDigit" />').css({
					height: options.digitHeight,
					float: 'left',
					background: 'url(\'' + options.image + '\')',
					width: options.digitWidth
				});
				elem.current = parseInt(options.startTime[i]);
				digits.push(elem);
				margin(c, -elem.current * options.digitHeight * options.digitImages);
				switch (options.format[i]) {
					case 'h':
						digits[c]._max = function(pos, isStart) {
							if (pos % 2 == 0)
								return 2;
							else
								return (isStart) ? 3: 9;
						};
						break;
					case 'd':
						digits[c]._max = function(){ return 9; };
						break;
					case 'm':
					case 's':
						digits[c]._max = function(pos){ return (pos % 2 == 0) ? 5: 9; };
				}
				++c;
			}
			else {
				elem = $('<div class="cntSeparator"/>').css({float: 'left'}).text(options.startTime[i]);
			}
			where.append(elem)
		}
	};
	
	var margin = function(elem, val) {
		if (val !== undefined) {
			digits[elem].margin = val;
			return digits[elem].css({'backgroundPosition': '0 ' + val + 'px'});
		}
		return digits[elem].margin || 0;
	};

	var makeMovement = function(elem, steps, isForward) {
		if (intervals[elem])
			window.clearInterval(intervals[elem]);
		var initialPos = -(options.digitHeight * options.digitImages * digits[elem].current);
		margin(elem, initialPos);
		digits[elem].current = digits[elem].current + ((isForward) ? -steps: steps);
		var x = 0;
		intervals[elem] = setInterval(function(){
			if (x++ === options.digitImages * steps) {
				window.clearInterval(intervals[elem]);
				delete intervals[elem];
				return;
			}
			var diff = isForward ? options.digitHeight: -options.digitHeight;
			margin(elem, initialPos + (x * diff));
		}, options.stepTime / steps);
	};

	var moveDigit = function(elem) {	 
		if(elem > 0) {
			isStart = (digits[elem - 1].current == 2 && digits[elem].current == 3);
		}	
		if (digits[elem].current == digits[elem]._max(elem,isStart)) {
			if (elem > 0) {
				makeMovement(elem, digits[elem]._max(elem, isStart), true);
				moveDigit(elem - 1);
			}
			else {
				for (var i = 0; i < digits.length; i++) {
					clearInterval(intervals[i]);
					margin(i, 0);
				}
				window.clearInterval(intervals.main);
				options.timerEnd();
			}
			return;
		}
		makeMovement(elem, 1);
	};

	$.extend(options, userOptions);
	createDigits(this);
	intervals.main = setInterval(function(){ moveDigit(digits.length - 1); }, 1000);
};