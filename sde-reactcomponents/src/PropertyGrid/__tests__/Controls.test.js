import React from 'react';
import {
    toHaveClass,
} from '@testing-library/jest-dom/matchers';
import {
    render, fireEvent,
} from '@testing-library/react';

import PropertyGridControls from '../Controls';

expect.extend({toHaveClass});

let showObjectsAs;
let showFunctionDefinitions;

const functionButtonText = 'function() {}';
const jsonButtonText = 'JSON';
const tableButtonText = 'Table';
const toStringButtonText = 'toString';

beforeEach(() => {
    showObjectsAs = undefined;
    showFunctionDefinitions = undefined;
});

describe('The PropertyGridControls component', () => {
    it('throws an error when passed an invalid showObjecsAs prop', () => {
        const construct = () => new PropertyGridControls({showObjectsAs: 'foo'});
        expect(construct).toThrowError(/The supplied value "foo" of the prop showObjectsAs is not valid/);
    });

    describe('renders correctly', () => {
        describe('function button', () => {
            it('is not shown when the object has no function properties', () => {
                const controls = renderControls('json', true, false);
                const find = () => controls.getByText(functionButtonText);
                expect(find).toThrowError(/Unable to find an element with the text/);
            });

            it('is shown when the object has function properties', () => {
                const controls = renderControls('json', true, true);
                controls.getByText(functionButtonText);
            });

            it('is highlighted when showFunctionDefinitions is true', () => {
                const controls = renderControls('json', true);
                const button = controls.getByText(functionButtonText);
                expect(button).toHaveClass('btn-primary active');
            });

            it('is not highlighted when showFunctionDefinitions is false', () => {
                const controls = renderControls('json', false);
                const button = controls.getByText(functionButtonText);
                expect(button).toHaveClass('btn-secondary');
            });
        });

        describe('object radio buttons', () => {
            it('are not shown when the object has no function properties', () => {
                const controls = renderControls('none');
                const find = () => getObjectRadioButtons(controls);
                expect(find).toThrowError(/Unable to find an element with the text/);
            });

            it('are shown when the object has object properties', () => {
                const controls = renderControls('json');
                getObjectRadioButtons(controls);
            });

            it('JSON button is highlighted when object properties are to be shown as JSON', () => {
                const controls = renderControls('json');
                const {jsonButton, tableButton, toStringButton} = getObjectRadioButtons(controls);
                expect(jsonButton).toHaveClass('btn-primary active');
                expect(tableButton).toHaveClass('btn-secondary');
                expect(toStringButton).toHaveClass('btn-secondary');
            });

            it('Table button is highlighted when object properties are to be shown as a table', () => {
                const controls = renderControls('table');
                const {jsonButton, tableButton, toStringButton} = getObjectRadioButtons(controls);
                expect(jsonButton).toHaveClass('btn-secondary');
                expect(tableButton).toHaveClass('btn-primary active');
                expect(toStringButton).toHaveClass('btn-secondary');
            });

            it('toString button is highlighted when object properties are to be shown as toString', () => {
                const controls = renderControls('tostring');
                const {jsonButton, tableButton, toStringButton} = getObjectRadioButtons(controls);
                expect(jsonButton).toHaveClass('btn-secondary');
                expect(tableButton).toHaveClass('btn-secondary');
                expect(toStringButton).toHaveClass('btn-primary active');
            });
        });
    });

    describe('function button', () => {
        describe('when clicked', () => {
            it('to show function definitions, calls the appropriate callback', () => {
                const controls = renderControls('json', false);
                const button = controls.getByText(functionButtonText);
                fireEvent.click(button);
                expect(showFunctionDefinitions).toBe(true);
            });

            it('to hide function definitions, calls the appropriate callback', () => {
                const controls = renderControls('json', true);
                const button = controls.getByText(functionButtonText);
                fireEvent.click(button);
                expect(showFunctionDefinitions).toBe(false);
            });
        });
    });

    describe('object radio buttons', () => {
        it('when the JSON option is selected, calls the appropriate callback', () => {
            const controls = renderControls('tostring');
            const {jsonButton} = getObjectRadioButtons(controls);
            fireEvent.click(jsonButton);
            expect(showObjectsAs).toBe('json');
        });

        it('when the Table option is selected, calls the appropriate callback', () => {
            const controls = renderControls('json');
            const {tableButton} = getObjectRadioButtons(controls);
            fireEvent.click(tableButton);
            expect(showObjectsAs).toBe('table');
        });

        it('when the toString option is selected, calls the appropriate callback', () => {
            const controls = renderControls('json');
            const {toStringButton} = getObjectRadioButtons(controls);
            fireEvent.click(toStringButton);
            expect(showObjectsAs).toBe('tostring');
        });
    });
});

const renderControls = (showObjectsAs = 'json', showFunctionDefinitions = true, showFunctionDefinitionsButton = true) => {
    const jsx = (
        <PropertyGridControls
            showObjectsAs={showObjectsAs}
            setShowObjectsAs={setShowObjectsAs}
            showFunctionDefinitions={showFunctionDefinitions}
            setShowFunctionDefinitions={setShowFunctionDefinitions}
            showFunctionDefinitionsButton={showFunctionDefinitionsButton}
        />
    );

    return render(jsx);
};

const setShowObjectsAs = (as) => {
    showObjectsAs = as;
};

const setShowFunctionDefinitions = (show) => {
    showFunctionDefinitions = show;
};

const getObjectRadioButtons = (controls) => {
    return {
        jsonButton: controls.getByText(jsonButtonText),
        tableButton: controls.getByText(tableButtonText),
        toStringButton: controls.getByText(toStringButtonText),
    };
};
