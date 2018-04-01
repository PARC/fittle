/**
 * Created by krivacic on 6/3/17.
 */

/** TESTS FOR BADGES API **/

import {TestHelpers} from '../../../../imports/test-helpers';
import {Badges} from '../badges';
describe("Badges collection and API", function () {

    /** Helpers for test readability */
    const assert = TestHelpers.assert;
    const catchError = TestHelpers.catch;
    const isErrorWithMessage = TestHelpers.isErrorWithMessage;
    const areEqual = TestHelpers.areEqual;
    const isNotNull = assert.isNotNull;

    const VALID_USERID = "test_id";
    const VALID_USERID2 = "test_id2";
    const VALID_BADGETYPE = 'post';
    const VALID_BADGETYPE2 = 'p2p';
    const VALID_SUBTYPE = "";
    const VALID_BADGEINFO = {id: 3, val: "hi"};

    const USERID_MISSING = "User ID is required";
    const BADGE_TYPE_MISSING = "Badge type is required";
    const BADGE_SUBTYPE_MISSING = "Sub type is required";
    const BADGE_INFO_MISSING = "Info is required";

    context("Inserting data.", function () {

        var _badgeData = null;

        beforeEach(function () {
            _badgeData = Badges.create(
                VALID_USERID,
                VALID_BADGETYPE,
                VALID_SUBTYPE,
                VALID_BADGEINFO,
            );
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should insert new badge if all values are valid.", function () {
            // When
            Badges.insert(_badgeData);
            // Then
            const badge = Badges.findOne(_badgeData);
            isNotNull(badge, "Insert failed. Didn't receive inserted object");

            areEqual(JSON.stringify(badge.info), JSON.stringify(VALID_BADGEINFO));
            areEqual(badge.type, VALID_BADGETYPE);
            areEqual(badge.subType, VALID_SUBTYPE);
            areEqual(badge.userId, VALID_USERID);
        });

        it("Should throw error if userId is null.", function () {
            _badgeData.userId = null;
            const err = catchError(()=>Badges.insert(_badgeData));
            isErrorWithMessage(err, USERID_MISSING);
        });

        it("Should throw error if badge type is null.", function () {
            _badgeData.type = null;
            const err = catchError(()=>Badges.insert(_badgeData));
            isErrorWithMessage(err, BADGE_TYPE_MISSING);
        });

        it("Should throw error if badge sub-type is null.", function () {
            _badgeData.subType = null;
            const err = catchError(()=>Badges.insert(_badgeData));
            isErrorWithMessage(err, BADGE_SUBTYPE_MISSING);
        });

        it("Should throw error if badge info is null.", function () {
            _badgeData.info = null;
            const err = catchError(()=>Badges.insert(_badgeData));
            isErrorWithMessage(err, BADGE_INFO_MISSING);
        });

        it("Should delete only your badges.", function () {
            Badges.insert(_badgeData);
            _badgeData.type = VALID_BADGETYPE2;
            Badges.insert(_badgeData);
            _badgeData.userId = VALID_USERID2;
            _badgeData.type = VALID_BADGETYPE;
            Badges.insert(_badgeData);

            const count = Badges.find({}).count();
            areEqual(count, 3);

            Badges.clearBadges(VALID_USERID, VALID_BADGETYPE, VALID_SUBTYPE);

            const count4 = Badges.find({}).count();
            areEqual(count4, 2);

            const count1 = Badges.find({userId: VALID_USERID}).count();
            areEqual(count1, 1);
        });
    });


});