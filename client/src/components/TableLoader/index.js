import React from 'react';

const TableLoader = ({data}) => {
    if (data.loading) {
        return (
            <div className="table-loader-wrap">
                <div className="table-loader">
                    <div className="ui active inverted dimmer">
                        <div className="ui text loader">Loading</div>
                    </div>
                </div>
            </div>
        )
    } else {
        return null;
    }
}

const TableFiller = ({data}) => {
    if (data.loading) {
        return (
            <tr className="table-loader-filler"></tr>
        )
    } else {
        return null;
    }
}

export {
    TableLoader,
    TableFiller
}
