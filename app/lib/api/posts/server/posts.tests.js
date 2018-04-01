/** TESTS FOR PARTICIPANTS API **/

import {TestHelpers} from '/imports/test-helpers';
import {Faker} from '/imports/test-helpers';
import {Posts} from '../posts';
describe("Posts collection and API", function () {
    const MISSING_CONDITION_ERR_MSG = '';
    /** Helpers for test readability */
    const assert = TestHelpers.assert;
    const catchError = TestHelpers.catch;
    const isErrorWithMessage = TestHelpers.isErrorWithMessage;
    const areEqual = TestHelpers.areEqual;
    const isNotNull = assert.isNotNull;
    const isNull = assert.isNull;
    const isUndefined = TestHelpers.isUndefined;
    const isError = assert.isError;

    const MALFORMED = {thiscantberight: "woof"};
    ;
    /**
     * Values used throughout tests. Defined here to make code management easier, reduce
     * code duplication, and make understanding the schema a little easier.
     */
    const VALID_EMAIL = Faker.email();
    const MALFORMED_EMAIL = "user@isp";
    const VALID_TEXT = Faker.sentence();
    const VALID_TOPIC = "topic";
    const INVALID_TOPIC = 0;
    const VALID_USER_ID = "validuseridfortest";
    const NO_TEXT = "";
    const NO_IMAGES = [];
    const VALID_IMAGES = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4Ki08EsgAAAINJREFUKBVtkUESwCAIAwX//2VbkxonRTmIIQvSaTxftIhoNaZ11BNQhaEz86iDZQMuCjXfpoNhA0yEYIp19N6bfDJTkL7BaoQ3xqBM8DfYa84kDC/w2VLzF2LCeyU1axXPC2tcSYaK0Li7FsOVJHxvNclT/v2HOhED6pD9DYCrqameX++4TB3IeP0NAAAAAElFTkSuQmCC"];
    const VALID_LIKES = 1;
    const INVALID_LIKES = -1;
    /** Expected (error) messages. */
    const MISSING_EMAIL_ERR_MSG = "Email address is required";
    const MALFORMED_EMAIL_ERR_MSG = "Email address failed regular expression validation";
    const MISSING_TOPIC_ERR_MSG = "Topic is required";
    const MALFORMED_COMMENTS_ERR_MSG = "Comments must be an array";
    const MALFORMED_IMAGES_ERR_MSG = "Images must be an array";
    const MALFORMED_LIKERS_ERR_MSG = "Likers must be an array";
    const MALFORMED_LIKES_ERR_MSG = "Likes must be a number";
    const MALFORMED_TEXT_ERR_MSG = "Text must be a string";
    const MALFORMED_TOPIC_ERR_MSG = "Topic must be a string";
    const INVALID_LIKES_ERR_MSG = "Likes must be at least 0"
    const INVALID_TOPIC_ERR_MSG = "Topic cannot exceed 100 characters";
    const VALID_SOURCE = Posts.createBio(VALID_USER_ID, VALID_EMAIL, "My Bio",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEDWlDQ1BJQ0MgUHJvZmlsZQAAOI2NVV1oHFUUPrtzZyMkzlNsNIV0qD8NJQ2TVjShtLp/3d02bpZJNtoi6GT27s6Yyc44M7v9oU9FUHwx6psUxL+3gCAo9Q/bPrQvlQol2tQgKD60+INQ6Ium65k7M5lpurHeZe58853vnnvuuWfvBei5qliWkRQBFpquLRcy4nOHj4g9K5CEh6AXBqFXUR0rXalMAjZPC3e1W99Dwntf2dXd/p+tt0YdFSBxH2Kz5qgLiI8B8KdVy3YBevqRHz/qWh72Yui3MUDEL3q44WPXw3M+fo1pZuQs4tOIBVVTaoiXEI/MxfhGDPsxsNZfoE1q66ro5aJim3XdoLFw72H+n23BaIXzbcOnz5mfPoTvYVz7KzUl5+FRxEuqkp9G/Ajia219thzg25abkRE/BpDc3pqvphHvRFys2weqvp+krbWKIX7nhDbzLOItiM8358pTwdirqpPFnMF2xLc1WvLyOwTAibpbmvHHcvttU57y5+XqNZrLe3lE/Pq8eUj2fXKfOe3pfOjzhJYtB/yll5SDFcSDiH+hRkH25+L+sdxKEAMZahrlSX8ukqMOWy/jXW2m6M9LDBc31B9LFuv6gVKg/0Szi3KAr1kGq1GMjU/aLbnq6/lRxc4XfJ98hTargX++DbMJBSiYMIe9Ck1YAxFkKEAG3xbYaKmDDgYyFK0UGYpfoWYXG+fAPPI6tJnNwb7ClP7IyF+D+bjOtCpkhz6CFrIa/I6sFtNl8auFXGMTP34sNwI/JhkgEtmDz14ySfaRcTIBInmKPE32kxyyE2Tv+thKbEVePDfW/byMM1Kmm0XdObS7oGD/MypMXFPXrCwOtoYjyyn7BV29/MZfsVzpLDdRtuIZnbpXzvlf+ev8MvYr/Gqk4H/kV/G3csdazLuyTMPsbFhzd1UabQbjFvDRmcWJxR3zcfHkVw9GfpbJmeev9F08WW8uDkaslwX6avlWGU6NRKz0g/SHtCy9J30o/ca9zX3Kfc19zn3BXQKRO8ud477hLnAfc1/G9mrzGlrfexZ5GLdn6ZZrrEohI2wVHhZywjbhUWEy8icMCGNCUdiBlq3r+xafL549HQ5jH+an+1y+LlYBifuxAvRN/lVVVOlwlCkdVm9NOL5BE4wkQ2SMlDZU97hX86EilU/lUmkQUztTE6mx1EEPh7OmdqBtAvv8HdWpbrJS6tJj3n0CWdM6busNzRV3S9KTYhqvNiqWmuroiKgYhshMjmhTh9ptWhsF7970j/SbMrsPE1suR5z7DMC+P/Hs+y7ijrQAlhyAgccjbhjPygfeBTjzhNqy28EdkUh8C+DU9+z2v/oyeH791OncxHOs5y2AtTc7nb/f73TWPkD/qwBnjX8BoJ98VVBg/m8AAAUCSURBVHgB7VrNjxRFFK/qWdZAZMnOznb1tMTEGycNhq/EgySi4R8gXDxpOHHExBgCiZhwIODRgybcOED4B4D4kaiJCuFDDt4kHpzp7mFcdyUsAaYfr8w26emuqq7qrp7tzc5cuqvee7/33q9e1XR3FSHT35SBKQObmQE6ieS7LvuJUvqOkS8gX/Si4LSRTQnl2gjwmQcl4hGbAPR6UfiaWFit1yoBvuu+T6hzvVpIauteGFiN2QrY3Nxc+9Wt24bq0O1KbRFRmQCrpW7KEUAfp4ZvapbWr0LAVkz+cRpsve6rVINTJmifsctNSZ7Hv1aFs2VyMa4A/EsL8C+NlXFWt82zePT2YDC4Y+LHiABMfhmTnzNxMGldUxK0pwCW/bdNT56TvcVp3caL9nTQqgB/YWEXmdnyx6RHs4o/3YVRrwI2WPKcON2/58IK0AXSHS3ZyHSZ9wMG864ujpaexnPCjAqILbKPVHITGRCI+mEo/ffoh8HBBM8a6ZR2E0zZVVkB1gIB+Bef2OZlQYj6sSIGGFxHJDPtk1Udx5GuAbjq/2LqSKZvmjzHwYpYlOHZ7JcSQAjdb8NRDPHxsjiqkTPBVFWykADPdU+YOFDpBlH0lUq+3jIhAQ51zq93YLb9+y77W4QpJECkuOH7KBW+NucI6C6yzzZ8sgYJ5AigDj1rYF+oynawNwqVJqTgu96ZrKscAVmFqu1wOXxQFcOaPSWnsli1E5B12LT2lID0iHgL3r50ezPcj1eAQ/baTlr1FFbkq4ptEXYiHyPAofGeRLBZrmMEAHG215G41/EOmuKWsTH1wfXHCKAAt8qAFNk4LfJ9kU5WXsYmi6HTHiNg5JCbOkZldLqdjvb08ha90m+QprHlPojUufDovt5OMoaxCjBlz1RfJzEdHVO/Kv2JEsAD4Qn68/OvZ4PCl7BvJp08j0H5UTQbZIX2EpZ/m9t3GXtAZ1/5C5PNwwH5FE+FnOOCOsgAgJ+zTvNrgMtuEEoPZRXLtmXzHrfZvsadpmMcF7ezduOe3l2RD5tEiGLJEcCDqOoUIP6wH0WXRAmV7cPPdKfxS9XnZe25Xe0EiBxUCVhiS3GAYolM2S2KT7wIAtxTImWEOLf+FIFn1Gw1oYwvmY1wCvBITaaBDNxWxjIcGzGKK0DmUdAPQK4JupvVBfEHsoCkBOiOaj8KDsvA6+6P49ERHR+9KLoh05MSwA3wpONDmWET+oPB4GpRHI9WHy+odJQEFO3P4eL3XAXeBNnKyso/qjiUBHBDnArbpACj529KZQ0Q6EzjQgIwj1UCcF+UT384XPdjM/jQJdzHVA5cKhkdAghubzd2pPGJ88tUPmu3cAVvVvP9+R4tAriZTjnl4Sffg+tS2AvDo7qetQnggE0nAZNf6Ueh4DVTTocRAQ0lYS0H+A6T3yFP1bIE99t/54+i7XZ7p2Vobbiu6/3IY/j/HKO2lV1FfmIcTJ7Jbbm35Vf6MmQSaOpE1xDXCSsnu2T+E7JHMXwcDsKLMj3dfisEJM6S4Hjb5oLZ6XT82dbM2hEX+BVX+QOJz6pXqwQkweD6cBc/q73F27gyw5NnT+eXlpaWE7nOlTF2qEXoy5cYPG32CR64uqBja6JTCwHpAJAM6TdGTg5+F5TGgKdLT+LpUqsnVtKx8Xup86yizTaO7nutmO4BSvZSEv8Xg3OLxORmMAx+s+lnijVlYMpAIQMvABpTiYuYjK6CAAAAAElFTkSuQmCC"
    );


    context("Inserting data.", function () {

        var _postData = null;

        beforeEach(function () {
            _postData = Posts.create(VALID_EMAIL, VALID_USER_ID, VALID_SOURCE, VALID_TEXT, VALID_TOPIC, VALID_IMAGES);
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should insert new document if all values are valid.", function () {
            // When
            Posts.insert(_postData);
            // Then
            const post = Posts.findOne(_postData);
            isNotNull(post, "Insert failed. Didn't receive inserted object");
            areEqual(post.emailAddress, VALID_EMAIL);
            areEqual(post.text, VALID_TEXT);
            areEqual(post.topic, VALID_TOPIC);
            areEqual(JSON.stringify(post.images), JSON.stringify(VALID_IMAGES));
            areEqual(post.deleted, false);
        });

        it("Should throw error on missing email address.", function () {
            _postData.emailAddress = null;
            const err = catchError(()=>Posts.insert(_postData));
            isErrorWithMessage(err, MISSING_EMAIL_ERR_MSG);
        });

        it("Should throw error if email address is malformed.", function () {
            _postData.emailAddress = MALFORMED_EMAIL;
            const err = catchError(()=>Posts.insert(_postData));
            isErrorWithMessage(err, MALFORMED_EMAIL_ERR_MSG);
        });

        it("Should throw error if comments is malformed.", function () {
            _postData.comments = MALFORMED;
            const err = catchError(()=>Posts.insert(_postData));
            isErrorWithMessage(err, MALFORMED_COMMENTS_ERR_MSG);
        });

        it("Should throw error if images is malformed.", function () {
            _postData.images = MALFORMED;
            const err = catchError(()=>Posts.insert(_postData));
            isErrorWithMessage(err, MALFORMED_IMAGES_ERR_MSG);
        });

        it("Should throw error if likers is malformed.", function () {
            _postData.likers = MALFORMED;
            const err = catchError(()=>Posts.insert(_postData));
            isErrorWithMessage(err, MALFORMED_LIKERS_ERR_MSG);
        });

        it("Should throw error if likes is malformed.", function () {
            _postData.likes = MALFORMED;
            const err = catchError(()=>Posts.insert(_postData));
            isErrorWithMessage(err, MALFORMED_LIKES_ERR_MSG);

        });

        it("Should throw error if likes is negative.", function () {
            _postData.likes = -1;
            const err = catchError(()=>Posts.insert(_postData));
            isErrorWithMessage(err, INVALID_LIKES_ERR_MSG);
        });

        it("Should throw error if text is malformed.", function () {
            _postData.text = MALFORMED;
            const err = catchError(()=>Posts.insert(_postData));
            isErrorWithMessage(err, MALFORMED_TEXT_ERR_MSG);
        });

        it("Should throw error if topic is malformed.", function () {
            _postData.topic = MALFORMED;
            const err = catchError(()=>Posts.insert(_postData));
            isErrorWithMessage(err, MALFORMED_TOPIC_ERR_MSG);
        });

        it("Should throw error if topic is too long.", function () {
            _postData.topic = Faker.arbitraryStringOfLength(101);
            const err = catchError(()=>Posts.insert(_postData));
            isErrorWithMessage(err, INVALID_TOPIC_ERR_MSG);
        });

        it("Should throw error if topic is missing.", function () {
            _postData.topic = null;
            const err = catchError(()=>Posts.insert(_postData));
            isErrorWithMessage(err, MISSING_TOPIC_ERR_MSG);
        });

    });


    context("Creating post data.", function () {
        beforeEach(function () {
            TestHelpers.resetDatabase();
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should throw error if text and images are empty.", function () {
            let _postData = Posts.create(VALID_EMAIL, VALID_USER_ID, VALID_SOURCE, NO_TEXT, "woof", NO_IMAGES);
            isNull(_postData, "Post data should be null if there is no text or images");
            const err = catchError(()=>Posts.insert(_postData));
            isErrorWithMessage(err, 'Cannot read property \'_id\' of null');
        });

    });


});

describe('Unit Test', function () {
    describe('Posts.getTeam', function () {
        context("Retrieving team string with Posts.getTeams", function () {
            const areEqual = TestHelpers.areEqual;

            const VALID_EMAIL = Faker.email();
            const VALID_TEXT = Faker.sentence();
            const VALID_USER_ID = "validuseridfortest";
            const VALID_TOPIC = "topic";
            const ANOTHER_VALID_TOPIC = "anotherTopic";
            const VALID_IMAGES = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4Ki08EsgAAAINJREFUKBVtkUESwCAIAwX//2VbkxonRTmIIQvSaTxftIhoNaZ11BNQhaEz86iDZQMuCjXfpoNhA0yEYIp19N6bfDJTkL7BaoQ3xqBM8DfYa84kDC/w2VLzF2LCeyU1axXPC2tcSYaK0Li7FsOVJHxvNclT/v2HOhED6pD9DYCrqameX++4TB3IeP0NAAAAAElFTkSuQmCC"];
            const VALID_SOURCE = Posts.createBio(VALID_USER_ID, VALID_EMAIL, "My Bio",
                "data:image/png;base64,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"
            );
            var _postData = null;
            const VALID_TEAM_STRING = [VALID_TOPIC, ANOTHER_VALID_TOPIC].sort().join(', ');

            beforeEach(function () {
                _postData = Posts.create(VALID_EMAIL, VALID_USER_ID, VALID_SOURCE, VALID_TEXT, VALID_TOPIC, VALID_IMAGES);
                Posts.insert(_postData);
                _postData = Posts.create(VALID_EMAIL, VALID_USER_ID, VALID_SOURCE, VALID_TEXT, ANOTHER_VALID_TOPIC, VALID_IMAGES);
                Posts.insert(_postData);
                areEqual(Posts.find().count(), 2), "Should have two posts in database for test";

            });

            afterEach(function () {
                TestHelpers.resetDatabase();
            });

            it("Should return valid team string from valid Posts data.", function () {
                areEqual(Posts.getTeams(), VALID_TEAM_STRING);
            });

        });

    })
});
