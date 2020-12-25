import React from 'react';
import Row from '../Row';
import { 
    render 
} from '@testing-library/react';

describe('The PropertyGridRow component', () => {
    it('', () => {
        const row = renderInTable("foo", "bar");
        row.getByText('foo');
        row.getByText('bar');
        row.getByText('string');
    });
});

const renderInTable = (propertyName, propertyValue) => {
    const jsx = (
        <table>
            <tbody>
                <Row 
                    propertyName={propertyName} 
                    propertyValue={propertyValue} 
                    showObjectsAs="json"
                    showFunctionDefinitions={true}
                />
            </tbody>
        </table>
    );
    return render(jsx);
};