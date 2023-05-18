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
                expect(error.message).toEqual("Event name must start with an alphabetic character");
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