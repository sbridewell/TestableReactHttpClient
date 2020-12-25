import React from 'react';
import {
    render,
} from '@testing-library/react';

import PropertyGrid from '../PropertyGrid';

const basicObject = {
    foo: 'foo',
    bar: 'bar',
};

const objectWithFunctionProperties = {
    foo: 'foo',
    myFunction: () => { return true; },
};

const objectWithObjectProperties = {
    foo: 'foo',
    bar: {
        one: 1,
        two: 'two',
    },
};

const functionButtonText = 'function() {}';
const jsonButtonText = 'JSON';
const tableButtonText = 'Table';
const toStringButtonText = 'toString';

describe('The PropertyGrid component', () => {
    it('renders without crashing', () => {
        renderGrid(basicObject);
    });

    describe('when passed a value with no function or object properties', () => {
        it('shows no showFunctionDefinition button', () => {
            const grid = renderGrid(basicObject);
            const find = () => { grid.getByText(functionButtonText); };
            expect(find).toThrowError(/Unable to find an element with the text/);
        });

        it('shows no shoObjectsAs radio buttons', () => {
            const grid = renderGrid(basicObject);
            const find = () => { getObjectRadioButtons(grid); };
            expect(find).toThrowError(/Unable to find an element with the text/);
        });
    });

    describe('when passed a value with function properties', () => {
        it('shows a showFunctionDefinition button', () => {
            const grid = renderGrid(objectWithFunctionProperties);
            grid.getByText(functionButtonText);
        });

        it('shows no showObjectsAs radio buttons', () => {
            const grid = renderGrid(objectWithFunctionProperties);
            const find = () => { getObjectRadioButtons(grid); };
            expect(find).toThrowError(/Unable to find an element with the text/);
        });
    });

    describe('when passed a value with object properties', () => {
        it('shows showObjectsAs radio buttons', () => {
            const grid = renderGrid(objectWithObjectProperties);
            getObjectRadioButtons(grid);
        });

        it('shows no showFunctionDefiniton button', () => {
            const grid = renderGrid(objectWithObjectProperties);
            const find = () => { grid.getByText(functionButtonText); };
            expect(find).toThrowError(/Unable to find an element with the text/);
        });
    });
});

const renderGrid = (value, title = 'My property grid', showObjectsAs = 'json') => {
    const jsx = (
        <PropertyGrid
            value={value}
            title={title}
            showObjectsAs={showObjectsAs}
        />
    );

    return render(jsx);
};

const getObjectRadioButtons = (controls) => {
    return {
        jsonButton: controls.getByText(jsonButtonText),
        tableButton: controls.getByText(tableButtonText),
        toStringButton: controls.getByText(toStringButtonText),
    };
};
