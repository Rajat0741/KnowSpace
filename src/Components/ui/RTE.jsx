import { useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide-dark/skin.min.css';

// Import essential plugins for a complete rich text editor
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/accordion';
import { Controller } from 'react-hook-form'
import { useEffect, useState } from 'react';



function RTE({ name, control, label, defaultvalue = "", onEditorInit, ...props }) {
    const isDarkMode = useSelector(state => state.darkMode.isDarkMode);
    const [localDarkMode, setLocalDarkMode] = useState(isDarkMode);
    const [editorContent, setEditorContent] = useState("");

    useEffect(() => {
        setLocalDarkMode(isDarkMode);
    }, [isDarkMode]);

    // Initialize editor content with defaultvalue and update when it changes
    useEffect(() => {
        setEditorContent(defaultvalue || "");
    }, [defaultvalue]);

    const handleEditorChange = (content) => {
        setEditorContent(content);
    };

    return (
        <>
            <div className='w-full' {...props}>
                {label && <label className='inline-block m-1 pl-1 '>{label}</label>}
                <Controller
                    name={name || "Content:"}
                    control={control}
                    render={({ field: { onChange } }) => (
                        <Editor
                            key={localDarkMode ? 'dark' : 'light'}
                            init={{
                                height: 600,
                                min_height: 600,
                                max_height: 700,
                                license_key: 'gpl',
                                base_url: '/tinymce',
                                skin: localDarkMode ? 'oxide-dark' : 'oxide',
                                content_css: localDarkMode ? 'dark' : 'default',
                                menubar: true,
                                promotion: false,
                                branding: false,
                                
                                // Enhanced free features
                                resize: true, // Allow manual resize
                                // autoresize_bottom_margin: 16, // Commented out to maintain fixed height
                                autosave_ask_before_unload: true,
                                autosave_interval: '15s',
                                autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
                                autosave_restore_when_empty: true,
                                
                                // Quick toolbars
                                quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
                                
                                // Context menu
                                contextmenu: 'link image table spellchecker',
                                
                                // Image settings
                                image_advtab: true,
                                image_caption: true,
                                image_description: false,
                                image_title: true,
                                automatic_uploads: true,
                                file_picker_types: 'image',
                                
                                // Table settings
                                table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
                                table_appearance_options: true,
                                table_grid: true,
                                table_cell_advtab: true,
                                
                                // Link settings
                                link_context_toolbar: true,
                                link_assume_external_targets: true,
                                
                                // Code sample settings
                                codesample_languages: [
                                    { text: 'HTML/XML', value: 'markup' },
                                    { text: 'JavaScript', value: 'javascript' },
                                    { text: 'CSS', value: 'css' },
                                    { text: 'PHP', value: 'php' },
                                    { text: 'Ruby', value: 'ruby' },
                                    { text: 'Python', value: 'python' },
                                    { text: 'Java', value: 'java' },
                                    { text: 'C', value: 'c' },
                                    { text: 'C#', value: 'csharp' },
                                    { text: 'C++', value: 'cpp' }
                                ],
                                
                                // Content formatting
                                block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre',
                                font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
                                
                                // Advanced list options
                                advlist_bullet_styles: 'square circle disc',
                                advlist_number_styles: 'lower-alpha lower-roman upper-alpha upper-roman',
                                
                                // Media settings
                                media_live_embeds: true,
                                
                                // Browser spellcheck
                                browser_spellcheck: true,
                                
                                // Additional free content features
                                paste_as_text: true,
                                paste_remove_styles_if_webkit: true,
                                paste_webkit_styles: "font-weight font-style color text-decoration",
                                
                                // Advanced formatting options
                                extended_valid_elements: "video[src|poster|width|height|controls|preload],audio[src|controls|preload],iframe[src|width|height|frameborder|allow|allowfullscreen]",
                                custom_elements: "~custom-element",
                                
                                // Status bar
                                statusbar: true,
                                elementpath: true,
                                
                                // Content protection
                                protect: [
                                    /<\/?(if|endif)>/g, // Protect <if> and <endif>
                                    /<xmp>[\s\S]*?<\/xmp>/g // Protect <xmp> tags
                                ],
                                
                                // URL handling
                                convert_urls: false,
                                remove_script_host: false,
                                relative_urls: true,
                                
                                // Additional formatting
                                formats: {
                                    alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', styles: { textAlign: 'left' } },
                                    aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', styles: { textAlign: 'center' } },
                                    alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', styles: { textAlign: 'right' } },
                                    alignjustify: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', styles: { textAlign: 'justify' } },
                                    bold: { inline: 'strong' },
                                    italic: { inline: 'em' },
                                    underline: { inline: 'u' },
                                    strikethrough: { inline: 'del' },
                                    customformat: { inline: 'span', styles: { color: '#00ff00', fontSize: '20px' }, attributes: { title: 'My custom format' } }
                                },
                                plugins: [
                                    "image",
                                    "advlist",
                                    "autolink",
                                    "lists",
                                    "link",
                                    "charmap",
                                    "preview",
                                    "anchor",
                                    "searchreplace",
                                    "visualblocks",
                                    "code",
                                    "fullscreen",
                                    "insertdatetime",
                                    "media",
                                    "table",
                                    "help",
                                    "wordcount",
                                    // Additional free plugins (autoresize can be used for dynamic height adjustment)
                                    "autoresize",
                                    "autosave", 
                                    "codesample",
                                    "directionality",
                                    "emoticons",
                                    "importcss",
                                    "nonbreaking",
                                    "pagebreak",
                                    "quickbars",
                                    "save",
                                    "visualchars",
                                    "accordion"
                                ],
                                toolbar: [
                                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough",
                                    "forecolor backcolor | alignleft aligncenter alignright alignjustify | ltr rtl", 
                                    "bullist numlist checklist | outdent indent | accordion | removeformat",
                                    "charmap emoticons nonbreaking | link unlink anchor | image media table",
                                    "codesample | insertdatetime pagebreak hr | searchreplace | visualblocks visualchars",
                                    "preview fullscreen | save | help"
                                ].join(" | "),
                                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                            }}
                            value={editorContent}
                            onInit={(evt, editor) => {
                                if (onEditorInit) {
                                    onEditorInit(editor);
                                }
                            }}
                            onEditorChange={(content) => {
                                handleEditorChange(content);
                                onChange(content);
                            }}
                        />
                    )
                    }
                />
            </div>
        </>
    );
}

export default RTE;