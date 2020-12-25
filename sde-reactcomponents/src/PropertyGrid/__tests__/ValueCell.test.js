import React from 'react';
import {
    render,
} from '@testing-library/react';
import ValueCell from '../ValueCell';

describe('The PropertyValueCell component', () => {
    describe('renders the correct value', () => {
        it('when passed a string', () => {
            const value = "foo";
            const table = renderCellInTable(value, 'json', true);
            table.getByText('foo');
        });

        it('when passed a number', () => {
            const value = 1;
            const table = renderCellInTable(value, 'json', true);
            table.getByText('1');
        });

        it('when passed a boolean', () => {
            const value = true;
            const table = renderCellInTable(value, 'json', true);
            table.getByText('true');
        });

        it('when passed null', () => {
            const value = null;
            const table = renderCellInTable(value, 'json', true);
            table.getByText('[null]');
        });

        it('when passed undefined', () => {
            const value = undefined;
            const table = renderCellInTable(value, 'json', true);
            table.getByText('[undefined]');
        });

        it('when passed a Symbol', () => {
            const value = Symbol('foo');
            const table = renderCellInTable(value, 'json', true);
            table.getByText('Symbol(foo)');
        });

        describe('when passed a date', () => {
            const value = new Date();
            it('when showObjectsAs is "table"', () => {
                const table = renderCellInTable(value, 'table', true);
                table.getByText(value.toString());
            });
    
            it('when showObjectsAs is "json"', () => {
                const table = renderCellInTable(value, 'json', true);
                table.getByText(JSON.stringify(value));
            });

            it('when showObjectsAs is "tostring"', () => {
                const table = renderCellInTable(value, 'tostring', true);
                table.getByText(value.toString());
            });
        });

        describe('when passed an object', () => {
            const value = {foo: "bar"};
            it('when showObjectsAs is "table"', () => {
                const table = renderCellInTable(value, 'table', true);
                // check for embedded table headings
                table.getByText('Name');
                table.getByText('Value');
                table.getByText('Type');
                // check for the property name, value and type in the embedded table
                table.getByText('foo');
                table.getByText('bar');
                table.getByText('string');
            });

            it('when showObjectsAs is "json"', () => {
                const table = renderCellInTable(value, 'json', true);
                table.getByText('{ "foo": "bar" }');
            });

            it('when showObjectsAs is "tostring"', () => {
                const table = renderCellInTable(value, 'tostring', true);
                table.getByText('[object Object]');
            });
        });

        describe('when passed a function', () => {
            const value = () => {return true;};
            it('when showFunctionDefinitions is true', () => {
                const table = renderCellInTable(value, 'json', true);
                table.getByText('return true', {exact: false});
            });

            it('when showFunctionDefinitions is false', () => {
                const table = renderCellInTable(value, 'json', false);
                table.getByText('[function]');
            });
        });
    });
});

const renderCellInTable = (value, showObjectsAs, showFunctionDefinitions) => {
    return render(
        <table>
            <tbody>
                <tr>
                    <ValueCell 
                        propertyValue={value} 
                        showObjectsAs={showObjectsAs}
                        showFunctionDefinitions={showFunctionDefinitions}
                    />
                </tr>
            </tbody>
        </table>
    );
};