var expect = require('expect.js');

function Game() {
	var frames = [[]];

	function nextFrame() {
		frames.push([]);
	}

	function frameBall(frame, i) {
		if (frame[i]) { return frame[i]; } else { return 0; }
	}

	function isSpareOrStrike(frame){
		return frameBall(frame, 0) + frameBall(frame, 1) === 10;
	}

	function isStrike(frame){
		return frameBall(frame, 0) === 10;
	}

	function calculateFrameScore(currentFrameIndex){
		var currentFrame = frames[currentFrameIndex];
		var total = frameBall(currentFrame, 0) + frameBall(currentFrame, 1);
		var lastFrame = frames[(currentFrameIndex -1)];
		if(!lastFrame){
			return total;
		}

		if(isSpareOrStrike(lastFrame)){
			total += frameBall(currentFrame, 0);
		}
		if(isStrike(lastFrame)){
			total += frameBall(currentFrame, 1);
		}
		return total;
	}

	function currentFrame() {
		return frames[frames.length - 1];
	}

	function endOfFrame(){
		return currentFrame().length === 2 || currentFrame()[0] === 10;
	}

	return {
		score : function () {
			var total = 0;
			for(var i = 0; i < frames.length; i++){
				total += calculateFrameScore(i);
			}
			return total;
		},
		roll : function (pinCount){
			currentFrame().push(pinCount);

			if (endOfFrame()){
				nextFrame();
			}

			console.log('current: ', currentFrame());
			console.log('frames: ', frames);
		}
	};
}

		var game = Game();
		game.roll(3);
		game.roll(5);
		game.roll(5);
		game.roll(1);
		console.log(game.score());


describe('bowling game', function () {
	it('should return 0 if there have been no rolls', function(){
		var game = Game();

		expect(game.score()).to.be(0);
	});

	it('should return 1 if you roll 1', function(){
		var game = Game();
		game.roll(1);
		expect(game.score()).to.be(1);
	});

	it('should return 2 if you roll a 1 and a 1', function(){
		var game = Game();
		game.roll(1);
		game.roll(1);
		expect(game.score()).to.be(2);
	});

	it('should return the correct score when a spare is rolled', function(){
		var game = Game();
		game.roll(5);
		game.roll(5);
		game.roll(1);
		expect(game.score()).to.be(12);
	});

	it('should return score when ten is rolled between frames', function(){
		var game = Game();
		game.roll(3);
		game.roll(5);
		game.roll(5);
		game.roll(1);
		expect(game.score()).to.be(14);
	});

	it('should return the correct score when a strike is rolled',function(){
		var game = Game();
		game.roll(10);
		game.roll(1);
		game.roll(4);
		expect(game.score()).to.be(20);
	});
});