import React from 'react';
import {
    render,
} from '@testing-library/react';
import TypeCell from '../TypeCell';

describe('The PropertyTypeCell component', () => {
    describe('renders the correct type', () => {
        it('when passed an anonymous object', () => {
            const value = {foo: "foo"};
            const table = renderCellInTable(value);
            table.getByText('object (Object)');
        });

        it('when passed a string', () => {
            const value = "foo";
            const table = renderCellInTable(value);
            table.getByText('string');
        });

        it('when passed a number', () => {
            const value = 1;
            const table = renderCellInTable(value);
            table.getByText('number');
        });

        it('when passed a date', () => {
            const value = new Date();
            const table = renderCellInTable(value);
            table.getByText('object (Date)');
        });

        it('when passed a boolean', () => {
            const value = true;
            const table = renderCellInTable(value);
            table.getByText('boolean');
        });

        it('when passed null', () => {
            const value = null;
            const table = renderCellInTable(value);
            table.getByText('null');
        });

        it('when passed undefined', () => {
            const value = undefined;
            const table = renderCellInTable(value);
            table.getByText('null');
        });

        it('when passed a function', () => {
            const value = () => {return true;};
            const table = renderCellInTable(value);
            table.getByText('function');
        });

        it('when passed a Symbol', () => {
            const value = Symbol('foo');
            const table = renderCellInTable(value);
            table.getByText('symbol');
        });
    });
});

const renderCellInTable = (value) => {
    return render(
        <table>
            <tbody>
                <tr>
                    <TypeCell propertyValue={value} />
                </tr>
            </tbody>
        </table>
    );
};