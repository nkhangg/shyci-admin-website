import React, { forwardRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
export interface IEditorProps {
    value: string;
    title?: string;
    setValue: (v: string) => void;
    onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

const Editor = forwardRef(function Editor({ value, title, setValue, onBlur }: IEditorProps, ref: any) {
    return (
        <div ref={ref} className="flex flex-col justify-center gap-1 w-full text-[#212636] ">
            {title && <span className="text-md font-medium text-gray-400">{title}</span>}
            <div id="editor" data-color-mode="light" className="">
                <MDEditor
                    onBlur={onBlur}
                    style={{
                        backgroundColor: '#f9f9f9',
                    }}
                    previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                    }}
                    value={value}
                    onChange={(val) => setValue(val || '')}
                />
            </div>
        </div>
    );
});

Editor.displayName = 'Editor';

export default Editor;
