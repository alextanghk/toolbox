import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

/*
    target lib cropperjs, Tesseract.js 
    
*/

interface PageParam {

}

type PageProps = RouteComponentProps<PageParam>;

class OCRTester extends React.Component<PageProps, Object> {

    render() {
        return(<div></div>)
    }
}

export default withRouter(OCRTester);