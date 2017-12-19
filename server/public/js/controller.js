/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 47);
/******/ })
/************************************************************************/
/******/ ({

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

let socket, targetId;
const Shake = __webpack_require__(48);

const init = () => {
  targetId = getUrlParameter(`id`);
  if (!targetId) {
    alert(`missing id`);
    return;
  }

  socket = io.connect(`/`);
  console.log(`CONTROLLER.JS`);

  window.addEventListener(`deviceorientation`, handleOrientation, true);
  shake();
};

const getUrlParameter = name => {
  name = name.replace(/[\[]/, `\\[`).replace(/[\]]/, `\\]`);
  const regex = new RegExp(`[\\?&]${  name  }=([^&#]*)`);
  const results = regex.exec(location.search);
  return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ` `));
};

const handleOrientation = e => {
  socket.emit(`update`, targetId, {
    alpha: e.alpha,
    beta: e.beta,
    gamma: e.gamma
  });

};

const shake = () => {
  let shakeEvent = new Shake({threshold: 15});
  shakeEvent.start();
  window.addEventListener(`shake`, sendAlert)
}

const sendAlert = e => {
  socket.emit('update', targetId, {
    shaked: true
  });
  document.getElementById(`title`).innerHTML = `shaked`;
}

init();


/***/ }),

/***/ 48:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 * Author: Alex Gibson
 * https://github.com/alexgibson/shake.js
 * License: MIT license
 */

(function(global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
            return factory(global, global.document);
        }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(global, global.document);
    } else {
        global.Shake = factory(global, global.document);
    }
} (typeof window !== 'undefined' ? window : this, function (window, document) {

    'use strict';

    function Shake(options) {
        //feature detect
        this.hasDeviceMotion = 'ondevicemotion' in window;

        this.options = {
            threshold: 15, //default velocity threshold for shake to register
            timeout: 1000 //default interval between events
        };

        if (typeof options === 'object') {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.options[i] = options[i];
                }
            }
        }

        //use date to prevent multiple shakes firing
        this.lastTime = new Date();

        //accelerometer values
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;

        //create custom event
        if (typeof document.CustomEvent === 'function') {
            this.event = new document.CustomEvent('shake', {
                bubbles: true,
                cancelable: true
            });
        } else if (typeof document.createEvent === 'function') {
            this.event = document.createEvent('Event');
            this.event.initEvent('shake', true, true);
        } else {
            return false;
        }
    }

    //reset timer values
    Shake.prototype.reset = function () {
        this.lastTime = new Date();
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;
    };

    //start listening for devicemotion
    Shake.prototype.start = function () {
        this.reset();
        if (this.hasDeviceMotion) {
            window.addEventListener('devicemotion', this, false);
        }
    };

    //stop listening for devicemotion
    Shake.prototype.stop = function () {
        if (this.hasDeviceMotion) {
            window.removeEventListener('devicemotion', this, false);
        }
        this.reset();
    };

    //calculates if shake did occur
    Shake.prototype.devicemotion = function (e) {
        var current = e.accelerationIncludingGravity;
        var currentTime;
        var timeDifference;
        var deltaX = 0;
        var deltaY = 0;
        var deltaZ = 0;

        if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
            this.lastX = current.x;
            this.lastY = current.y;
            this.lastZ = current.z;
            return;
        }

        deltaX = Math.abs(this.lastX - current.x);
        deltaY = Math.abs(this.lastY - current.y);
        deltaZ = Math.abs(this.lastZ - current.z);

        if (((deltaX > this.options.threshold) && (deltaY > this.options.threshold)) || ((deltaX > this.options.threshold) && (deltaZ > this.options.threshold)) || ((deltaY > this.options.threshold) && (deltaZ > this.options.threshold))) {
            //calculate time in milliseconds since last shake registered
            currentTime = new Date();
            timeDifference = currentTime.getTime() - this.lastTime.getTime();

            if (timeDifference > this.options.timeout) {
                window.dispatchEvent(this.event);
                this.lastTime = new Date();
            }
        }

        this.lastX = current.x;
        this.lastY = current.y;
        this.lastZ = current.z;

    };

    //event handler
    Shake.prototype.handleEvent = function (e) {
        if (typeof (this[e.type]) === 'function') {
            return this[e.type](e);
        }
    };

    return Shake;
}));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGI3YzA1YmM4N2Q4ZTBiZWRmNDEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NoYWtlLmpzL3NoYWtlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9DQUFvQyxTQUFTO0FBQzdDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBLDhCQUE4QixjQUFjO0FBQzVDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTs7Ozs7Ozs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFBQTtBQUNULEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQyIsImZpbGUiOiJqcy9jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNDcpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDBiN2MwNWJjODdkOGUwYmVkZjQxIiwibGV0IHNvY2tldCwgdGFyZ2V0SWQ7XG5jb25zdCBTaGFrZSA9IHJlcXVpcmUoJ3NoYWtlLmpzJyk7XG5cbmNvbnN0IGluaXQgPSAoKSA9PiB7XG4gIHRhcmdldElkID0gZ2V0VXJsUGFyYW1ldGVyKGBpZGApO1xuICBpZiAoIXRhcmdldElkKSB7XG4gICAgYWxlcnQoYG1pc3NpbmcgaWRgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBzb2NrZXQgPSBpby5jb25uZWN0KGAvYCk7XG4gIGNvbnNvbGUubG9nKGBDT05UUk9MTEVSLkpTYCk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoYGRldmljZW9yaWVudGF0aW9uYCwgaGFuZGxlT3JpZW50YXRpb24sIHRydWUpO1xuICBzaGFrZSgpO1xufTtcblxuY29uc3QgZ2V0VXJsUGFyYW1ldGVyID0gbmFtZSA9PiB7XG4gIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtdLywgYFxcXFxbYCkucmVwbGFjZSgvW1xcXV0vLCBgXFxcXF1gKTtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBbXFxcXD8mXSR7ICBuYW1lICB9PShbXiYjXSopYCk7XG4gIGNvbnN0IHJlc3VsdHMgPSByZWdleC5leGVjKGxvY2F0aW9uLnNlYXJjaCk7XG4gIHJldHVybiByZXN1bHRzID09PSBudWxsID8gZmFsc2UgOiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1sxXS5yZXBsYWNlKC9cXCsvZywgYCBgKSk7XG59O1xuXG5jb25zdCBoYW5kbGVPcmllbnRhdGlvbiA9IGUgPT4ge1xuICBzb2NrZXQuZW1pdChgdXBkYXRlYCwgdGFyZ2V0SWQsIHtcbiAgICBhbHBoYTogZS5hbHBoYSxcbiAgICBiZXRhOiBlLmJldGEsXG4gICAgZ2FtbWE6IGUuZ2FtbWFcbiAgfSk7XG5cbn07XG5cbmNvbnN0IHNoYWtlID0gKCkgPT4ge1xuICBsZXQgc2hha2VFdmVudCA9IG5ldyBTaGFrZSh7dGhyZXNob2xkOiAxNX0pO1xuICBzaGFrZUV2ZW50LnN0YXJ0KCk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGBzaGFrZWAsIHNlbmRBbGVydClcbn1cblxuY29uc3Qgc2VuZEFsZXJ0ID0gZSA9PiB7XG4gIHNvY2tldC5lbWl0KCd1cGRhdGUnLCB0YXJnZXRJZCwge1xuICAgIHNoYWtlZDogdHJ1ZVxuICB9KTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHRpdGxlYCkuaW5uZXJIVE1MID0gYHNoYWtlZGA7XG59XG5cbmluaXQoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL2NvbnRyb2xsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDQ3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qXG4gKiBBdXRob3I6IEFsZXggR2lic29uXG4gKiBodHRwczovL2dpdGh1Yi5jb20vYWxleGdpYnNvbi9zaGFrZS5qc1xuICogTGljZW5zZTogTUlUIGxpY2Vuc2VcbiAqL1xuXG4oZnVuY3Rpb24oZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeShnbG9iYWwsIGdsb2JhbC5kb2N1bWVudCk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KGdsb2JhbCwgZ2xvYmFsLmRvY3VtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnbG9iYWwuU2hha2UgPSBmYWN0b3J5KGdsb2JhbCwgZ2xvYmFsLmRvY3VtZW50KTtcbiAgICB9XG59ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHRoaXMsIGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50KSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBTaGFrZShvcHRpb25zKSB7XG4gICAgICAgIC8vZmVhdHVyZSBkZXRlY3RcbiAgICAgICAgdGhpcy5oYXNEZXZpY2VNb3Rpb24gPSAnb25kZXZpY2Vtb3Rpb24nIGluIHdpbmRvdztcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0aHJlc2hvbGQ6IDE1LCAvL2RlZmF1bHQgdmVsb2NpdHkgdGhyZXNob2xkIGZvciBzaGFrZSB0byByZWdpc3RlclxuICAgICAgICAgICAgdGltZW91dDogMTAwMCAvL2RlZmF1bHQgaW50ZXJ2YWwgYmV0d2VlbiBldmVudHNcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnNbaV0gPSBvcHRpb25zW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vdXNlIGRhdGUgdG8gcHJldmVudCBtdWx0aXBsZSBzaGFrZXMgZmlyaW5nXG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIC8vYWNjZWxlcm9tZXRlciB2YWx1ZXNcbiAgICAgICAgdGhpcy5sYXN0WCA9IG51bGw7XG4gICAgICAgIHRoaXMubGFzdFkgPSBudWxsO1xuICAgICAgICB0aGlzLmxhc3RaID0gbnVsbDtcblxuICAgICAgICAvL2NyZWF0ZSBjdXN0b20gZXZlbnRcbiAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudC5DdXN0b21FdmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBkb2N1bWVudC5DdXN0b21FdmVudCgnc2hha2UnLCB7XG4gICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnQuaW5pdEV2ZW50KCdzaGFrZScsIHRydWUsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9yZXNldCB0aW1lciB2YWx1ZXNcbiAgICBTaGFrZS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB0aGlzLmxhc3RYID0gbnVsbDtcbiAgICAgICAgdGhpcy5sYXN0WSA9IG51bGw7XG4gICAgICAgIHRoaXMubGFzdFogPSBudWxsO1xuICAgIH07XG5cbiAgICAvL3N0YXJ0IGxpc3RlbmluZyBmb3IgZGV2aWNlbW90aW9uXG4gICAgU2hha2UucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIGlmICh0aGlzLmhhc0RldmljZU1vdGlvbikge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvL3N0b3AgbGlzdGVuaW5nIGZvciBkZXZpY2Vtb3Rpb25cbiAgICBTaGFrZS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzRGV2aWNlTW90aW9uKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9O1xuXG4gICAgLy9jYWxjdWxhdGVzIGlmIHNoYWtlIGRpZCBvY2N1clxuICAgIFNoYWtlLnByb3RvdHlwZS5kZXZpY2Vtb3Rpb24gPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgY3VycmVudCA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTtcbiAgICAgICAgdmFyIGN1cnJlbnRUaW1lO1xuICAgICAgICB2YXIgdGltZURpZmZlcmVuY2U7XG4gICAgICAgIHZhciBkZWx0YVggPSAwO1xuICAgICAgICB2YXIgZGVsdGFZID0gMDtcbiAgICAgICAgdmFyIGRlbHRhWiA9IDA7XG5cbiAgICAgICAgaWYgKCh0aGlzLmxhc3RYID09PSBudWxsKSAmJiAodGhpcy5sYXN0WSA9PT0gbnVsbCkgJiYgKHRoaXMubGFzdFogPT09IG51bGwpKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RYID0gY3VycmVudC54O1xuICAgICAgICAgICAgdGhpcy5sYXN0WSA9IGN1cnJlbnQueTtcbiAgICAgICAgICAgIHRoaXMubGFzdFogPSBjdXJyZW50Lno7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBkZWx0YVggPSBNYXRoLmFicyh0aGlzLmxhc3RYIC0gY3VycmVudC54KTtcbiAgICAgICAgZGVsdGFZID0gTWF0aC5hYnModGhpcy5sYXN0WSAtIGN1cnJlbnQueSk7XG4gICAgICAgIGRlbHRhWiA9IE1hdGguYWJzKHRoaXMubGFzdFogLSBjdXJyZW50LnopO1xuXG4gICAgICAgIGlmICgoKGRlbHRhWCA+IHRoaXMub3B0aW9ucy50aHJlc2hvbGQpICYmIChkZWx0YVkgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkKSkgfHwgKChkZWx0YVggPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkKSAmJiAoZGVsdGFaID4gdGhpcy5vcHRpb25zLnRocmVzaG9sZCkpIHx8ICgoZGVsdGFZID4gdGhpcy5vcHRpb25zLnRocmVzaG9sZCkgJiYgKGRlbHRhWiA+IHRoaXMub3B0aW9ucy50aHJlc2hvbGQpKSkge1xuICAgICAgICAgICAgLy9jYWxjdWxhdGUgdGltZSBpbiBtaWxsaXNlY29uZHMgc2luY2UgbGFzdCBzaGFrZSByZWdpc3RlcmVkXG4gICAgICAgICAgICBjdXJyZW50VGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB0aW1lRGlmZmVyZW5jZSA9IGN1cnJlbnRUaW1lLmdldFRpbWUoKSAtIHRoaXMubGFzdFRpbWUuZ2V0VGltZSgpO1xuXG4gICAgICAgICAgICBpZiAodGltZURpZmZlcmVuY2UgPiB0aGlzLm9wdGlvbnMudGltZW91dCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sYXN0WCA9IGN1cnJlbnQueDtcbiAgICAgICAgdGhpcy5sYXN0WSA9IGN1cnJlbnQueTtcbiAgICAgICAgdGhpcy5sYXN0WiA9IGN1cnJlbnQuejtcblxuICAgIH07XG5cbiAgICAvL2V2ZW50IGhhbmRsZXJcbiAgICBTaGFrZS5wcm90b3R5cGUuaGFuZGxlRXZlbnQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodHlwZW9mICh0aGlzW2UudHlwZV0pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1tlLnR5cGVdKGUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBTaGFrZTtcbn0pKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3NoYWtlLmpzL3NoYWtlLmpzXG4vLyBtb2R1bGUgaWQgPSA0OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiXSwic291cmNlUm9vdCI6IiJ9