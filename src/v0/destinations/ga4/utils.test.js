const { validateEventName } = require('./utils');

describe('Google Analytics 4 utils test', () => {
    describe('Unite test cases for validateEventName', () => {
        it('Should throw an error as event name uses reserved prefixes', () => {
            try {
                const output = validateEventName("_ga_conversion");
                expect(output).toEqual('');
            } catch (error) {
                expect(error.message).toEqual("Reserved custom prefix names are not allowed");
            }
        })

        it('Should throw an error as reserved custom event names are not allowed', () => {
            try {
                const output = validateEventName("app_store_refund");
                expect(output).toEqual('');
            } catch (error) {
                expect(error.message).toEqual("Reserved custom event names are not allowed");
            }
        })

        it('Should throw an error as event name starts with numbers', () => {
            try {
                const output = validateEventName("123 sign_up");
                expect(output).toEqual('');
            } catch (error) {
                expect(error.message).toEqual("Event name should only contain letters, numbers, and underscores and event name must start with a letter");
            }
        })

        it('Should throw an error as event name should only contain letters, numbers, and underscores', () => {
            try {
                const output = validateEventName("Grisly*_Open_General_Setting");
                expect(output).toEqual('');
            } catch (error) {
                expect(error.message).toEqual("Event name should only contain letters, numbers, and underscores and event name must start with a letter");
            }
        })

        it('Should throw an error as event name should only contain letters, numbers, and underscores', () => {
            try {
                const output = validateEventName("Test[]_Rudder$$");
                expect(output).toEqual('');
            } catch (error) {
                expect(error.message).toEqual("Event name should only contain letters, numbers, and underscores and event name must start with a letter");
            }
        })

        it('Should not throw an error as event name is valid', () => {
            try {
                const output = validateEventName("Grisly1234567_Open_General_Setting");
                expect(output).toEqual();
            } catch (error) {
                console.log(error.message);
                expect(error.message).toEqual();
            }
        })

        it('Should not throw an error as event name is valid', () => {
            try {
                const output = validateEventName("login");
                expect(output).toEqual();
            } catch (error) {
                expect(error.message).toEqual();
            }
        })
    })
})