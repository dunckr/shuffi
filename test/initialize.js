var tests = [
  './models/song_test',
  './models/list_test',
  './models/player_test'

];

for (var test in tests) {
  require(tests[test]);
}
