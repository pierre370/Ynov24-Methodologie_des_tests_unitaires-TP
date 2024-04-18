import User from './user.entities';
import {describe, expect, it, jest} from '@jest/globals';
import UserService from "./user.service.js";

describe('UserService', () => {

    const mockUsers = [
        new User("42@email.com", "42", 42, "4200a8f5185294c4fee1b41e"),
        new User("user1@example.com", "password", 30, "661fa8f5185294c4fee1b41e"),
        new User("user2@example.com", "password", 31, "001fa8f5185294c4fee1b41e"),
        new User("user3@example.com", "password", 32, "111fa8f5185294c4fee1b41e")
    ];

    const mockUserRepository = {
        getById: jest.fn((id) => mockUsers[0]),
        getByEmail: jest.fn((email) => mockUsers[0]),
        getAll: jest.fn(() => mockUsers),
        deleteById: jest.fn((id) => undefined),
        deleteAll: jest.fn(() => undefined),
        create: jest.fn((user) => new User(user.email, user.password, user.age, "661fa8f5185294c4fee1b41e")),
        update: jest.fn((user) => user),
    };

    const userService = new UserService(mockUserRepository);

    describe('addUser', () => {
        it('nominal case - should add a new user to the users array', async () => {
            // GIVEN
            const user = new User('test@example.com', 'password123', 42);
            const customMockUserRepository = {
                getByEmail: jest.fn(() => undefined),
                create: jest.fn((user) => new User(user.email, user.password, user.age, "661fa8f5185294c4fee1b41e"))
            }
            const customUserService = new UserService(customMockUserRepository);

            // WHEN
            const res = await customUserService.addUser(user);

            // THEN
            expect(res.email).toBe(user.email);
            expect(res.password).toBe(user.password);
            expect(res.age).toBe(user.age);
            expect(res._id).toBeDefined();
        });

        it('functional error - should throw an error if a user with the same email already exists', async () => {
            // GIVEN
            const existingUser = {...mockUsers[0]};

            // WHEN + THEN
            await expect(userService.addUser(existingUser)).rejects.toThrow('User already exists');
        });
    });

    describe('getUsers', () => {
        it('nominal case - should return an empty array if there are no users in the database', () => {
            // GIVEN
            const customMockUserRepository = {
                getAll: jest.fn(() => [])
            }
            const customUserService = new UserService(customMockUserRepository);

            // WHEN
            const res = customUserService.getUsers();

            // THEN
            expect(res).toEqual([]);
        });

        it('nominal case - should return an array of all users in the database', () => {
            expect(userService.getUsers().length).toEqual(4);
        });
    });

    describe('getUserById', () => {
        it('functional error - should throw an error if the user is not found', async () => {
            // GIVEN
            const customMockUserRepository = {
                getById: jest.fn(() => undefined)
            }
            const customUserService = new UserService(customMockUserRepository);

            // WHEN - THEN
            await expect(customUserService.getUserById("0")).rejects.toThrow('User does not exists');
        });

        it('nominal case - should return the correct user if the user is found', async () => {
            const res = await userService.getUserById(mockUsers[0]._id);
            expect(res).toEqual(mockUsers[0]);
        });
    });

    describe('login', () => {
        it('functional error - should throw an error if the email is not found', async () => {
            // GIVEN
            const customMockUserRepository = {
                getByEmail: jest.fn(() => undefined)
            }
            const customUserService = new UserService(customMockUserRepository);

            // WHEN
            try {
                await customUserService.login('name@a.com', '123456');

            // THEN
            } catch (error) {
                expect(error.message).toBe('Invalid Login');
            }
        });

        it('functional error - should throw an error if the password is incorrect', async () => {
            try {
                await userService.login(mockUsers[0].email, "wrong password");
            } catch (error) {
                expect(error.message).toBe('Invalid Login');
            }
        });

        it('nominal case - should return nothing', async () => {
            const res = await userService.login(mockUsers[0].email, mockUsers[0].password);
            expect(res).toBe(mockUsers[0]);
        });
    });

    // TODO updateUser & deleteUserById
});
