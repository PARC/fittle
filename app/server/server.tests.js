/**
 * Created by msilva on 7/30/16.
 */


import {createBuiltInUsers} from './server';
import { TestHelpers } from '../imports/test-helpers';
import { Factory } from 'meteor/dburles:factory';
import {Accounts} from 'meteor/accounts-base';
import {Roles} from 'meteor/alanning:roles';

describe('Server Start-up', function () {

    const BUILTIN_ADMIN_EMAIL_ADDRESS = "admin@parc.com";

    describe('Creating system administrator account.', function () {

        beforeEach(function () {
            // Delete all existing accounts.
            TestHelpers.resetDatabase();
        });

        context('No account exists', function(){

            let adminUser;

            beforeEach(function(){
                // When...
                createBuiltInUsers();
                adminUser = Accounts.findUserByEmail(BUILTIN_ADMIN_EMAIL_ADDRESS);
            });

            it('Should create administrator account', function () {
                // Then
                const adminUser = Accounts.findUserByEmail(BUILTIN_ADMIN_EMAIL_ADDRESS);
                TestHelpers.assert.isDefined(adminUser);
            });

            it('Should have only the admin security role.', function () {
                const expectedRoles = ['admin'];
                // Then
                const roles = Roles.getRolesForUser(adminUser);
                TestHelpers.assert.sameMembers(roles, expectedRoles);
            });


        });

        context('An account already exists', function(){

            beforeEach(function(){

                /** Note: Doing the Before here because it's a costly operation, and we don't want the setup
                        time to be included in the test time.  */

                // Given -- An admin account already exists
                const administrator = {email:"admin@parc.com", 'password':"password"};
                const userId = Accounts.createUser(administrator);
                Roles.addUsersToRoles(userId, 'admin', Roles.GLOBAL_GROUP);
                TestHelpers.areEqual(1, Roles.getUsersInRole('admin').fetch().length, "Test setup failed.");
            })

            it('Should not create an account or throw an error', function () {
                // When -- System starts again
                createBuiltInUsers();
                // Then -- There should be no new admins
                TestHelpers.areEqual(1, Roles.getUsersInRole('admin').fetch().length, "Expected there to be only one admin");
            });

        });
    });

    });

