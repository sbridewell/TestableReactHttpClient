import React from 'react';

import { PropertyGrid } from 'sde-reactcomponents';
import 'sde-reactcomponents/dist/index.css';

const App = () => {
    const value = {
        foo: 'foo',
        bar: 'bar',
        one: 1,
        now: new Date(),
        somethingUndefined: undefined,
        somethingNull: null,
        somethingComplex: {
            one: 1,
            two: true,
            when: new Date(),
            moreStuff: {
                three: '3',
                four: 4,
            },
        },
        arrowFunction: (foo, bar) => {
            return `You gave me ${foo} and ${bar}`;
        },
        es5Function: function(foo) {
            return `You gave me ${foo}`;
        },
        aSymbol: Symbol('foo'),
    }

    const propertyGrid1 = <PropertyGrid title="<PropertyGrid showObjectsAs='table' />" value={value} showObjectsAs="table" />;
    const propertyGrid2 = <PropertyGrid title="<PropertyGrid showObjectsAs='json' />" value={value} showObjectsAs="json" />;
    const propertyGrid3 = <PropertyGrid title="<PropertyGrid showObjectsAs='tostring' />" value={value} showObjectsAs="tostring" />;

    const jsx = (
        <div className="container">
            {propertyGrid1}
            <hr />
            {propertyGrid2}
            <hr />
            {propertyGrid3}
        </div>
    );

    return jsx;
}

export default App;
