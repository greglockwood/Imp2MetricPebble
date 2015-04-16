/// <reference path="../shared/format.js" />

var fmt = format;

describe('format', function () {
    var DONT_TRUNCATE = true;

    it('should work without units', function () {
        chai.assert.equal('1', fmt(1));
    });

    describe('test cases', function () {
        [
            {args: [1], expected: '1'},
            {args: [1, 'kg'], expected: '1 kg'},
            {args: [1.1, 'kg'], expected: '1.1 kg'},
            {args: [0, 'kg'], expected: '0 kg'},
            {args: [500, 'in'], expected: '500 in'},
            {args: [1500, 'in'], expected: '1500 in'},
            {args: [10000, 'cm'], expected: '10 k cm'},
            {args: [10100, 'cm'], expected: '10.1 k cm'},
            {args: [100000, 'mi'], expected: '100 k mi'},
            {args: [1000000, 'mi'], expected: '1 mil mi'},
            {args: [1001000, 'mi'], expected: '1 mil mi'},
            {args: [1010000, 'mi'], expected: '1.01 mil mi'},
            {args: [1010000, 'mi', DONT_TRUNCATE], expected: '1010000 mi'},
            {args: [1010000.451, 'mi', DONT_TRUNCATE], expected: '1010000.45 mi'},
            {args: [1010000.456, 'mi', DONT_TRUNCATE], expected: '1010000.46 mi'},
            {args: [1010000.49999, 'mi', DONT_TRUNCATE], expected: '1010000.5 mi'},
            {args: [5000000, 'nmi'], expected: '5 mil nmi'},
            {args: [500000, 'ft'], expected: '500 k ft'},
            {args: [500000-1, 'ft'], expected: '500 k ft'},
            {args: [1000000, 'ft'], expected: '1 mil ft'},
            {args: [1000000-1, 'ft'], expected: '1 mil ft'}
        ].forEach(function (test) {
                it('should output "' + test.expected + '" when passed (' + test.args.map(JSON.stringify).join() + ')', function () {
                    chai.assert.equal(fmt.apply(null, test.args), test.expected);
                });
            });
    });
});