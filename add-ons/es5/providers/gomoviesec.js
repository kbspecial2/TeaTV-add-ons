

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = {
    DOMAIN: "http://gomovies.ec",
    SEARCH: function SEARCH(title) {
        return 'https://gomovies.ec/movie/search/' + title;
    },
    HEADERS: function HEADERS(referer) {
        return {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
            'referer': referer
        };
    }, EMBED: function EMBED(ep) {
        return 'https://gomovies.ec/ajax/v2_get_sources?id=' + ep;
    }

};

var Gomoviesec = function () {
    function Gomoviesec(props) {
        _classCallCheck(this, Gomoviesec);

        this.libs = props.libs;
        this.movieInfo = props.movieInfo;
        this.settings = props.settings;

        this.state = {};
    }

    _createClass(Gomoviesec, [{
        key: 'searchDetail',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _libs, httpRequest, cheerio, stringHelper, _movieInfo, title, year, season, episode, type, detailUrl, urlSearch, dataSearch, $, as;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _libs = this.libs, httpRequest = _libs.httpRequest, cheerio = _libs.cheerio, stringHelper = _libs.stringHelper;
                                _movieInfo = this.movieInfo, title = _movieInfo.title, year = _movieInfo.year, season = _movieInfo.season, episode = _movieInfo.episode, type = _movieInfo.type;
                                detailUrl = false;
                                _context.prev = 3;
                                urlSearch = URL.SEARCH(stringHelper.convertToSearchQueryString(title));
                                _context.next = 7;
                                return httpRequest.getHTML(urlSearch);

                            case 7:
                                dataSearch = _context.sent;
                                $ = cheerio.load(dataSearch);
                                as = $('.movies-list .ml-item a');


                                as.each(function () {
                                    var hrefMovie = $(this).attr('href');
                                    var titleMovie = $(this).attr('title');
                                    var seasonMovie = titleMovie.match(/ *season *([0-9]+)/i);
                                    seasonMovie = seasonMovie != null ? +seasonMovie[1] : false;

                                    if (seasonMovie != false) {
                                        titleMovie = titleMovie.replace(/ - *season.*/i, '');
                                    } else {
                                        titleMovie = titleMovie.replace(/ \([0-9]+\)/i, '');
                                    }

                                    if (stringHelper.shallowCompare(title, titleMovie)) {
                                        if (type == 'movie' && hrefMovie.search(year)) {
                                            detailUrl = hrefMovie;
                                        } else if (type == 'tv' && seasonMovie == season) {
                                            detailUrl = hrefMovie;
                                        }
                                    }
                                });
                                _context.next = 16;
                                break;

                            case 13:
                                _context.prev = 13;
                                _context.t0 = _context['catch'](3);

                                console.log(String(_context.t0));

                            case 16:

                                if (detailUrl) detailUrl = detailUrl + 'watching.html';

                                this.state.detailUrl = detailUrl;
                                return _context.abrupt('return');

                            case 19:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[3, 13]]);
            }));

            function searchDetail() {
                return _ref.apply(this, arguments);
            }

            return searchDetail;
        }()
    }, {
        key: 'getHostFromDetail',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var _libs2, httpRequest, cheerio, qs, _movieInfo2, title, year, season, episode, type, hosts, detailUrl, htmlDetail, $, episode_id, s, embedHtml, js, playHtml, js1, i, url;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _libs2 = this.libs, httpRequest = _libs2.httpRequest, cheerio = _libs2.cheerio, qs = _libs2.qs;
                                _movieInfo2 = this.movieInfo, title = _movieInfo2.title, year = _movieInfo2.year, season = _movieInfo2.season, episode = _movieInfo2.episode, type = _movieInfo2.type;

                                if (this.state.detailUrl) {
                                    _context2.next = 4;
                                    break;
                                }

                                throw new Error("NOT_FOUND");

                            case 4:
                                hosts = [];
                                detailUrl = this.state.detailUrl;
                                _context2.next = 8;
                                return httpRequest.getHTML(this.state.detailUrl);

                            case 8:
                                htmlDetail = _context2.sent;
                                $ = cheerio.load(htmlDetail);
                                episode_id = false;

                                if (type == 'movie') {
                                    s = htmlDetail.match(/episode_id: ([0-9]+)/);

                                    if (s != undefined) episode_id = s[1];
                                } else {
                                    $('.le-server .les-content a').each(function () {
                                        var url = $(this).attr('href');
                                        var tit = $(this).text().trim();

                                        if ('Episode ' + episode == tit) {
                                            var m = url.match(/episode_id=([0-9]+)/);
                                            if (m != undefined) episode_id = m[1];
                                        }
                                    });
                                }

                                _context2.next = 14;
                                return httpRequest.getHTML(URL.EMBED(episode_id));

                            case 14:
                                embedHtml = _context2.sent;
                                _context2.prev = 15;

                                js = JSON.parse(embedHtml);
                                _context2.next = 22;
                                break;

                            case 19:
                                _context2.prev = 19;
                                _context2.t0 = _context2['catch'](15);
                                throw new Error('NOT_FOUND');

                            case 22:
                                if (js.status) {
                                    _context2.next = 24;
                                    break;
                                }

                                throw new Error('NO_LINK');

                            case 24:

                                if (js.value.indexOf('//') == 0) js.value = 'https:' + js.value;

                                _context2.next = 27;
                                return httpRequest.getHTML(js.value, {
                                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                                    'Referer': detailUrl
                                });

                            case 27:
                                playHtml = _context2.sent;
                                _context2.prev = 28;

                                js1 = JSON.parse(playHtml);
                                _context2.next = 35;
                                break;

                            case 32:
                                _context2.prev = 32;
                                _context2.t1 = _context2['catch'](28);
                                throw new Error('NOT_FOUND');

                            case 35:

                                for (i in js1.playlist) {
                                    url = js1.playlist[i].file;

                                    hosts.push({
                                        provider: {
                                            url: detailUrl,
                                            name: "Gomovies"
                                        },
                                        result: {
                                            file: url,
                                            label: "embed",
                                            type: url.indexOf('fbcdn') != -1 ? 'direct' : 'embed'
                                        }
                                    });
                                }

                                this.state.hosts = hosts;

                            case 37:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[15, 19], [28, 32]]);
            }));

            function getHostFromDetail() {
                return _ref2.apply(this, arguments);
            }

            return getHostFromDetail;
        }()
    }]);

    return Gomoviesec;
}();

thisSource.function = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(libs, movieInfo, settings) {
        var httpRequest, source, bodyPost;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        httpRequest = libs.httpRequest;
                        source = new Gomoviesec({
                            libs: libs,
                            movieInfo: movieInfo,
                            settings: settings
                        });
                        bodyPost = {
                            name_source: 'gomovies',
                            is_link: 0,
                            type: movieInfo.type,
                            season: movieInfo.season,
                            episode: movieInfo.episode,
                            title: movieInfo.title,
                            year: movieInfo.year
                        };
                        _context3.next = 5;
                        return source.searchDetail();

                    case 5:

                        if (!source.state.detailUrl) {
                            bodyPost.is_link = 0;
                        } else {
                            bodyPost.is_link = 1;
                        }
                        _context3.next = 8;
                        return source.getHostFromDetail();

                    case 8:

                        if (source.state.hosts.length == 0) {
                            bodyPost.is_link = 0;
                        } else {
                            bodyPost.is_link = 1;
                        }

                        //await httpRequest.post('https://api.teatv.net/api/v2/mns', {}, bodyPost);

                        return _context3.abrupt('return', source.state.hosts);

                    case 10:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x, _x2, _x3) {
        return _ref3.apply(this, arguments);
    };
}();

thisSource.testing = Gomoviesec;