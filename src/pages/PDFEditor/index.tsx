import React, { FunctionComponent, useState, useRef } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { RouteComponentProps, withRouter } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faPen, faUndo, faRedo, faImage } from '@fortawesome/free-solid-svg-icons';
import {Helmet} from "react-helmet";

// Props and State declare
interface PreviewProps {
    file: null|Uint8Array
}

interface ItemProps {
    onChange: Function,
    onClose: Function
}

interface TextItemState {
    text: string,
    page: number,
    posX: number,
    posY: number,
    fontSize: number,
    colorR: number,
    colorG: number,
    colorB: number,
}

interface ImageItemState {
    image: null|Uint8Array,
    imgType: string,
    page: number,
    posX: number,
    posY: number,
    width: number,
    height: number
}

interface PageParam {
    
}

type PageProps = RouteComponentProps<PageParam>;

function FileToArrayBuffer({ file }: { file: any}):Promise<Uint8Array> {
    return new Promise((resolve,reject)=>{
        const reader = new FileReader();
        reader.onload = (event: any) => {
            let arrayBuffer = event.target.result;
            if (arrayBuffer === undefined) reject(new Error("fail"));
            resolve(arrayBuffer);
        };
        try {
            reader.readAsArrayBuffer(file);
        } catch(e) {
            reject(e);
        }
    })
}
const PDFImageItem:FunctionComponent<ItemProps> = ({
    onChange, 
    onClose
})=> {
    const [image, setImage] = useState<Uint8Array | null>(null);
    const [imgType, setImgType] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [width, setWidth] = useState<number>(100);
    const [height, setHeight] = useState<number>(100);
    const [posX,setPosX] = useState<number>(0);
    const [posY,setPosY] = useState<number>(0);

    const handleOnFileSelect = (e:any) => {
        let selected = new Blob([e.target.files[0]]);
        setImgType(e.target.files[0].type);
        FileToArrayBuffer({ file: selected}).then((file:Uint8Array)=>{
            setImage(file);
        });
    }

    return (<>
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                Fill in image
                            </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="mb-4 col-span-3">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_IMG">
                                    Image
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_IMG" type="file" accept="image/png,image/jpg" placeholder="" onChange={handleOnFileSelect} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_Page">
                                    Page
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_Page" type="number" step={1} min={1} value={page} placeholder="" onChange={(e:any)=> { setPage(parseInt(e.target.value)) } }/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_posX">
                                    Position (X)
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_posX" type="number" step={1} min={0} value={posX} placeholder="" onChange={(e:any)=> { setPosX(parseInt(e.target.value)) } }/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_posY">
                                    Position (Y)
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_posY" type="number" step={1} min={0} value={posY} placeholder="" onChange={(e:any)=> { setPosY(parseInt(e.target.value)) } }/>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_Width">
                                    Width
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_Width" type="number" step={1} min={0} value={width} placeholder="" onChange={(e:any)=> { setWidth(parseInt(e.target.value)) } }/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_Height">
                                    Height
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_Height" type="number" step={1} min={0} value={height} placeholder="" onChange={(e:any)=> { setHeight(parseInt(e.target.value)) } }/>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" 
                            onClick={() => { onChange({
                                image,
                                imgType,
                                page,
                                posX,
                                posY,
                                width,
                                height
                            }) }}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                        Apply
                        </button>
                        <button type="button" 
                            onClick={() => { onClose() }}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                        Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
const PDFTextItem:FunctionComponent<ItemProps> = ({
    onChange, 
    onClose
})=> {
    const [text, setText] = useState<string>(""); 
    const [page, setPage] = useState<number>(1);
    const [fontSize, setFontSize] = useState<number>(12);
    const [colorR,setColorR] = useState<number>(0);
    const [colorG,setColorG] = useState<number>(0);
    const [colorB,setColorB] = useState<number>(0);
    const [posX,setPosX] = useState<number>(0);
    const [posY,setPosY] = useState<number>(0);

    return (<>
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                Fill in text
                            </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="mb-4 col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_TEXT">
                                    Text
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_TEXT" type="text" placeholder="" onChange={(e:any)=> { setText(e.target.value) } } value={text}/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_fontSize">
                                    Font Size
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_fontSize" type="number" step={1} min={1} value={fontSize} placeholder="" onChange={(e:any)=> { setFontSize(parseInt(e.target.value)) } }/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_Page">
                                    Page
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_Page" type="number" step={1} min={1} value={page} placeholder="" onChange={(e:any)=> { setPage(parseInt(e.target.value)) } }/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_posX">
                                    Position (X)
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_posX" type="number" step={1} min={0} value={posX} placeholder="" onChange={(e:any)=> { setPosX(parseInt(e.target.value)) } }/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_posY">
                                    Position (Y)
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_posY" type="number" step={1} min={0} value={posY} placeholder="" onChange={(e:any)=> { setPosY(parseInt(e.target.value)) } }/>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_colorR">
                                    Color (R)
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_colorR" type="number" step={0.01} min={0} max={1} value={colorR} placeholder="" onChange={(e:any)=> { 
                                    const value = parseFloat(e.target.value);
                                    setColorR( value >= 0 && value <= 1 ? value : colorR ) } 
                                }/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_colorG">
                                    Color (G)
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_colorG" type="number" step={0.01} min={0} max={1} value={colorG} placeholder="" onChange={(e:any)=> { 
                                    const value = parseFloat(e.target.value);
                                    setColorG( value >= 0 && value <= 1 ? value : colorG ) } 
                                }/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PDFItem_colorB">
                                    Color (B)
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="PDFItem_colorB" type="number" step={0.01} min={0} max={1} value={colorB} placeholder="" onChange={(e:any)=> { 
                                    const value = parseFloat(e.target.value);
                                    setColorB( value >= 0 && value <= 1 ? value : colorB ) } 
                                }/>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" 
                            onClick={() => { onChange({
                                text,
                                page,
                                posX,
                                posY,
                                fontSize,
                                colorR,
                                colorG,
                                colorB
                            }) }}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                        Apply
                        </button>
                        <button type="button" 
                            onClick={() => { onClose() }}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                        Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

class PDFPreview extends React.PureComponent<PreviewProps, Object> {
    render() {
        const {file} = this.props;
        return (<embed className="min-w-full max-w-full max-h-screen min-h-screen" src={URL.createObjectURL(new Blob([file || ""],{type: "application/pdf"}))} type={`application/pdf`}/>);
    }
}

const PDFEditor:FunctionComponent<PageProps> = ({}) => {
    const [file,setFile] = useState<Uint8Array | null>(null);
    // const [origin,setOrigin] = useState<Uint8Array | null>(null);
    const [steps,setSteps] = useState<Array<Uint8Array>>([]);
    const [redo,setRedo] = useState<Array<Uint8Array>>([]);
    const [open,setOpen] = useState<Boolean>(false as Boolean);
    const [openImg,setOpenImg] = useState<Boolean>(false as Boolean);
    const [openText,setOpenText] = useState<Boolean>(false as Boolean);

    const fileUpload = useRef<HTMLInputElement>(null);

    const handleOnFileSelect = (e:any) => {
        let selected = new Blob([e.target.files[0]]);
        FileToArrayBuffer({ file: selected}).then((file:Uint8Array)=>{
            setFile(file);
            // setOrigin(file);
            setSteps([]);
            setRedo([]);
        });
    }

    const handleOnItemClose = (e:any) => {
        setOpen(false);
        setOpenImg(false);
        setOpenText(false);
    }
    const handleOnImageChange = async (item: ImageItemState) => {
        if (file !== null) {
            const { image, imgType, page, posX, posY, width, height } = item;
            const pdfDoc = await PDFDocument.load(file);
            
            const pages = pdfDoc.getPages()
            if (page !== null && page <= pages.length && image !== null) {
                const myPage = pages[page-1];
                const pdfImg = (imgType === "image/png") ? await pdfDoc.embedPng(image) : await pdfDoc.embedJpg(image);
                const imgDims = pdfImg.scale(1);
                myPage.drawImage(pdfImg, {
                    x: posX,
                    y: posY,
                    width: width === 0 ? imgDims.width : width,
                    height: height === 0 ? imgDims.height : height,
                })

                const pdfBytes = await pdfDoc.save();
                setFile(pdfBytes);
                steps.push(file);
                setSteps(steps);
                setRedo([]);
            }
        }

        setOpen(false)
        setOpenImg(false)
    }
    
    const handleOnTextChange = async (item: TextItemState) => {
        if (file !== null) {
            const { text, fontSize, page, posX, posY, colorR, colorG, colorB } = item;
            const pdfDoc = await PDFDocument.load(file);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const pages = pdfDoc.getPages()
            if (page !== null && page <= pages.length) {
                const myPage = pages[page-1];
                myPage.drawText(text, {
                    x: posX,
                    y: posY,
                    size: fontSize,
                    font: helveticaFont,
                    color: rgb(colorR,colorG,colorB),
                });
                const pdfBytes = await pdfDoc.save();
                setFile(pdfBytes);
                steps.push(file);
                setSteps(steps);
                setRedo([]);
            }
        }

        setOpen(false)
        setOpenText(false)
    }
    const handleOnRedo = (e:any) => {
        const target = redo[redo.length -1];
        redo.pop();

        if (file !== null) steps.push(file);

        console.log(redo);
        console.log(steps);

        setFile(target);
        setSteps(steps);
        setRedo(redo);
    }
    const handleOnRollBack = (e:any) => {
        const target = steps[steps.length -1];
        steps.pop();
        
        if (file !== null) redo.push(file);
        
        console.log(redo);
        console.log(steps);

        setFile(target);
        setSteps(steps);
        setRedo(redo);
    }

    const disabledItem = file ? (open === null ? false: (open ? true: false)) : true;

    return(<div className="relative container min-w-full">
            <Helmet>
                <title>PDF editor | Alex Toolbox</title>
            </Helmet>
            <PDFPreview file={file}/>
            <div className="absolute bottom-10 left-10">
            { 
                file && <div className="grid grid-rows-2 grid-cols-1 gap-4">
                    <div>
                        <button  
                            onClick={handleOnRedo}
                            disabled={ redo.length <= 0 }
                            className={`bg-${redo.length > 0 ? "blue" : "gray" }-500 hover:bg-${redo.length > 0 ? "blue" : "gray" }-700 text-white font-bold py-2 px-3 rounded-full`}>
                            <FontAwesomeIcon icon={faRedo} />
                        </button> 
                    </div>
                    <div>
                        <button  
                            onClick={handleOnRollBack}
                            disabled={ steps.length <= 0 }
                            className={`bg-${steps.length > 0 ? "blue" : "gray" }-500 hover:bg-${steps.length > 0 ? "blue" : "gray" }-700 text-white font-bold py-2 px-3 rounded-full`}>
                            <FontAwesomeIcon icon={faUndo} />
                        </button> 
                    </div>
                </div>
            }
            </div>
            <div className="absolute bottom-10 right-10">
                <div className="grid grid-rows-3 grid-cols-1 gap-4">
                    <div>
                        { file && <button  
                            onClick={()=>{setOpen(true); setOpenText(true)}}
                            disabled={ disabledItem }
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full">
                            <FontAwesomeIcon icon={faPen} />
                            </button> 
                        }
                        { openText && <PDFTextItem 
                            onClose={handleOnItemClose}
                            onChange={handleOnTextChange} />
                        }
                    </div>
                    <div>
                        { file && <button  
                            onClick={()=>{setOpen(true); setOpenImg(true)}}
                            disabled={ disabledItem }
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full">
                            <FontAwesomeIcon icon={faImage} />
                        </button>
                        }
                        { openImg && <PDFImageItem 
                            onClose={handleOnItemClose}
                            onChange={handleOnImageChange} />
                        }
                    </div>
                    <div>
                        <input type="file" accept="application/pdf" ref={fileUpload} id="SelectPDF" className="hidden" onChange={handleOnFileSelect}/>
                        <button  
                            onClick={()=>{ if(fileUpload.current !== null) fileUpload.current.click(); }}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full">
                            <FontAwesomeIcon style={{width: "16px", height: "16px"}} icon={faFileUpload} />
                        </button>
                    </div>
                </div>
            </div>
        </div>);
}


export default withRouter(PDFEditor);