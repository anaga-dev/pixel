import { b as buildAssetsURL } from '../../handlers/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'h3';
import 'devalue';
import 'vue/server-renderer';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'ofetch';
import 'unenv/runtime/fetch/index';
import 'hookable';
import 'scule';
import 'klona';
import 'defu';
import 'ohash';
import 'ufo';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'http-graceful-shutdown';

const Toolbar_vue_vue_type_style_index_0_scoped_77e8e6ac_lang = ".Toolbar[data-v-77e8e6ac]{background-color:var(--colorLayer1);box-shadow:var(--shadowLayer);grid-template-rows:1fr 3fr 1fr;height:100%;justify-content:center;padding:var(--spaceM) 0;width:100%}.Toolbar[data-v-77e8e6ac],.group[data-v-77e8e6ac]{display:grid;gap:var(--spaceM)}.group[data-v-77e8e6ac]{grid-auto-flow:row;justify-items:center}.group[data-v-77e8e6ac]:first-child{align-content:start}.group[data-v-77e8e6ac]:nth-child(2){align-content:center}.group[data-v-77e8e6ac]:last-child{align-content:end}";

const IconDropdown_vue_vue_type_style_index_0_scoped_e51c54bf_lang = "svg[data-v-e51c54bf]{fill:currentColor}";

const Button_vue_vue_type_style_index_0_scoped_15e75170_lang = ".button-wrap[data-v-15e75170]{filter:drop-shadow(calc(var(--spaceS)*-1) var(--spaceS) 0 var(--colorShadow));transition:all 60ms ease}button[data-v-15e75170]{align-items:center;background-color:var(--colorShade);-webkit-clip-path:var(--pixelCorners);clip-path:var(--pixelCorners);display:grid;font-weight:700;gap:var(--spaceS);grid-auto-flow:column;height:var(--spaceXL);justify-content:center;padding:0 var(--spaceM);text-transform:uppercase;transition:background-color .24s ease,transform 60ms ease;width:100%}button[data-v-15e75170]:is(.ghost,.dropdown){background-color:transparent;color:inherit;padding:var(--spaceS)}button:is(.ghost,.dropdown).active[data-v-15e75170]{color:var(--colorAccent)}button.primary[data-v-15e75170]{background-color:var(--colorAccent);color:var(--colorTextAlt)}button.critical[data-v-15e75170]{background-color:var(--colorCritical);color:var(--colorTextPrimary)}button[data-v-15e75170]:is(:not(.ghost,.dropdown,.primary,.critical)):hover{background-color:var(--colorHover)}button[data-v-15e75170]:is(.ghost,.dropdown):hover{background-color:var(--colorShade)}button[data-v-15e75170]:active{transform:translate(calc(var(--spaceXS)*-1),var(--spaceXS))}";

const ToolButton_vue_vue_type_style_index_0_scoped_6ff7d516_lang = "button[data-v-6ff7d516]{background-color:transparent;-webkit-clip-path:var(--pixelCorners);clip-path:var(--pixelCorners);display:grid;height:var(--spaceXL);padding:0 var(--spaceS);place-content:center;transition:all .24s ease}button[data-v-6ff7d516]:hover{background-color:var(--colorShade)}";

const Icon_vue_vue_type_style_index_0_scoped_bb65522d_lang = "svg[data-v-bb65522d]{fill:currentColor;display:flex}";

const HuePicker_vue_vue_type_style_index_0_scoped_07dfe8dc_lang = ".HuePicker[data-v-07dfe8dc]{background:linear-gradient(90deg,red,#ff8000,#ff0,#80ff00,#0f0,#00ff80,#0ff,#0080ff,#00f,#8000ff,#f0f,#ff0080,red);height:var(--spaceL);position:relative}.bar[data-v-07dfe8dc]{background-color:var(--colorLayer1);height:100%;pointer-events:none;position:absolute;width:2px}";

const CombinedColorPicker_vue_vue_type_style_index_0_scoped_aaf0e266_lang = ".CombinedColorPicker[data-v-aaf0e266]{aspect-ratio:16/9;display:block;overflow:hidden;position:relative;width:100%}canvas[data-v-aaf0e266]{height:100%;width:100%}.circle[data-v-aaf0e266]{border-radius:100%;box-shadow:0 0 0 1px #fff,0 0 0 2px #000;height:var(--spaceM);position:absolute;transform:translate(-50%,-50%);width:var(--spaceM)}";

const ColorHex_vue_vue_type_style_index_0_scoped_a7b5fef2_lang = ".hex-input[data-v-a7b5fef2]{gap:var(--spaceS);grid-auto-flow:column;justify-content:start}.hex[data-v-a7b5fef2],.hex-input[data-v-a7b5fef2]{align-items:center;display:grid}.hex[data-v-a7b5fef2]{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:var(--colorLayer0);border:none;color:var(--colorPrimary);font-weight:700;height:var(--spaceXL);padding:0 var(--spaceS);text-transform:uppercase}.key-buttons[data-v-a7b5fef2]{display:none;gap:1rem;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr)}.key-button[data-v-a7b5fef2]{background:var(--colorShade);font-size:2rem;padding:1rem}.form-input[data-v-a7b5fef2]{align-items:center;display:flex;margin-bottom:1rem}@media (hover:none){.key-buttons[data-v-a7b5fef2]{display:grid}}";

const Field_vue_vue_type_style_index_0_scoped_f86c4382_lang = ".Field[data-v-f86c4382]{display:grid;gap:var(--spaceS);grid-auto-flow:row}";

const Slider_vue_vue_type_style_index_0_scoped_e180fd99_lang = '.Slider[data-v-e180fd99]{display:grid;gap:var(--spaceM);grid-template-columns:1fr auto}input[type=range][data-v-e180fd99]{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;position:relative;width:100%}input[type=range][data-v-e180fd99]::-webkit-slider-runnable-track{background:var(--colorLayer0);height:var(--spaceS)}input[type=range][data-v-e180fd99]::-moz-range-track{background:var(--colorLayer0);height:var(--spaceS)}input[type=range][data-v-e180fd99]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;aspect-ratio:1;background-color:var(--colorAccent);border-radius:0;box-shadow:var(--shadowLayer);position:relative;top:50%;transform:translateY(-50%);width:var(--spaceL);z-index:2}input[type=range][data-v-e180fd99]::-moz-range-thumb{-moz-appearance:none;appearance:none;aspect-ratio:1;background-color:var(--colorAccent);border:none;border-radius:0;box-shadow:var(--shadowLayer);position:relative;top:50%;transform:translateY(-50%);width:var(--spaceL);z-index:2}input[type=range][data-v-e180fd99]:before{background:var(--colorAccent);content:"";height:var(--spaceS);pointer-events:none;position:absolute;top:50%;transform:translateY(-50%);width:var(--percent,100%);z-index:1}';

const ColorHSL_vue_vue_type_style_index_0_scoped_e56e07ba_lang = ".ColorHSL[data-v-e56e07ba]{display:grid;gap:var(--spaceL);grid-auto-flow:row}";

const ColorRGB_vue_vue_type_style_index_0_scoped_1c055ddc_lang = ".ColorRGB[data-v-1c055ddc]{display:grid;gap:var(--spaceL);grid-auto-flow:row}";

const PaletteColor_vue_vue_type_style_index_0_scoped_07c3557f_lang = ".PaletteColor[data-v-07c3557f]{aspect-ratio:1}.active[data-v-07c3557f]{border:2px solid var(--colorAccent)}";

const Palette_vue_vue_type_style_index_0_scoped_31c2ffc0_lang = ".Palette[data-v-31c2ffc0]{display:grid;gap:2px;grid-template-columns:repeat(auto-fit,minmax(var(--spaceL),1fr))}";

const TabMenu_vue_vue_type_style_index_0_scoped_8f8e3c95_lang = ".TabMenu[data-v-8f8e3c95]{display:grid;grid-auto-columns:1fr;grid-auto-flow:column;list-style-type:none;margin:0;padding:0}";

const Tab_vue_vue_type_style_index_0_scoped_5911a60c_lang = ".Tab[data-v-5911a60c]{display:grid;gap:var(--spaceXS);grid-auto-flow:column;justify-content:stretch;margin:0;padding:0}button[data-v-5911a60c]{font-weight:700;padding:var(--spaceS) var(--spaceM);transition:all .2s}button[data-v-5911a60c]:hover{color:var(--colorAccent)}";

const ColorPicker_vue_vue_type_style_index_0_scoped_a83b5552_lang = ".ColorPicker[data-v-a83b5552]{display:grid;gap:var(--spaceM);grid-auto-flow:row}.form-input[data-v-a83b5552]{display:flex;justify-content:space-between}.colors[data-v-a83b5552]{-webkit-clip-path:var(--pixelCorners);clip-path:var(--pixelCorners);display:grid;grid-template-columns:1fr 1fr;overflow:hidden}.color[data-v-a83b5552]{display:grid;padding:var(--spaceM);place-content:center}.color-name[data-v-a83b5552]{filter:invert(100%);font-weight:700;text-transform:uppercase}";

const Divider_vue_vue_type_style_index_0_scoped_06a2d170_lang = ".Divider[data-v-06a2d170]{height:var(--spaceXXS);width:100%}.Divider[data-v-06a2d170],.Divider.vertical[data-v-06a2d170]{background:var(--colorShade)}.Divider.vertical[data-v-06a2d170]{height:100%;width:var(--spaceXXS)}";

const Document_vue_vue_type_style_index_0_lang = '.paint{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA3SURBVHgB7dHBCQAwDAJAW7qR0zqUM7UbpI8QyCN+hUNwSboIYjuqsZHMAB2A8/uZJEoXDNABeAdlCFOqlI3sAAAAAElFTkSuQmCC");image-rendering:crisp-edges;image-rendering:pixelated;position:relative}.paint canvas{position:absolute}';

const Overlay_vue_vue_type_style_index_0_scoped_bc6cd314_lang = ".Overlay[data-v-bc6cd314]{animation:pixelate-bc6cd314 3s infinite alternate;-webkit-backdrop-filter:url(#pixelate);backdrop-filter:url(#pixelate);background-color:var(--colorOverlay);inset:0;position:fixed;z-index:999}@keyframes pixelate-bc6cd314{0%{--rad:0}to{--rad:4}}#pixelate feMorphology[data-v-bc6cd314]{radius:var(--radius)}";

const Modal_vue_vue_type_style_index_0_scoped_aca2b8ae_lang = ".wrapper[data-v-aca2b8ae]{display:grid;inset:0;place-content:center;position:fixed;z-index:1000}.Modal[data-v-aca2b8ae]{background-color:var(--colorLayer2);box-shadow:var(--shadowLayer);display:grid;gap:var(--spaceM);grid-auto-flow:row;justify-content:stretch;min-width:24rem;padding:var(--spaceL) var(--spaceL);z-index:1001}header[data-v-aca2b8ae]{align-items:center;display:flex;justify-content:space-between}";

const Select_vue_vue_type_style_index_0_scoped_db5f5c69_lang = '.Select[data-v-db5f5c69]{display:grid;grid-template-areas:"select"}select[data-v-db5f5c69]{padding-right:var(--spaceXL)}.icon[data-v-db5f5c69]{align-self:center;justify-self:end;margin-right:var(--spaceS);pointer-events:none}.icon[data-v-db5f5c69],select[data-v-db5f5c69]{grid-area:select}';

const DocumentCreate_vue_vue_type_style_index_0_scoped_a506a0f7_lang = "form[data-v-a506a0f7]{gap:var(--spaceL);grid-auto-flow:row}.size[data-v-a506a0f7],form[data-v-a506a0f7]{display:grid}.size[data-v-a506a0f7]{align-items:end;gap:var(--spaceM);grid-auto-flow:column;justify-content:start}";

const Selection_vue_vue_type_style_index_0_scoped_7c6a07a3_lang = ".selection[data-v-7c6a07a3]{left:0;position:fixed;top:0}";

const Dropdown_vue_vue_type_style_index_0_scoped_4d7e60c6_lang = ".Dropdown[data-v-4d7e60c6]{background-color:var(--colorLayer1);box-shadow:var(--shadowLayer);display:grid;gap:var(--spaceM);grid-auto-flow:row;justify-content:stretch;min-width:16rem;padding:var(--spaceM);position:fixed;z-index:1000}";

const Panel_vue_vue_type_style_index_0_scoped_fdf25c25_lang = ".Panel[data-v-fdf25c25]{background-color:var(--colorLayer1);box-shadow:var(--shadowLayer);display:flex;flex-direction:column;max-height:100%;overflow:hidden;padding:var(--spaceM);pointer-events:auto}header[data-v-fdf25c25]{align-items:center;display:flex;justify-content:space-between;padding:var(--spaceXS) var(--spaceXS) var(--spaceXS) var(--spaceM)}.actions[data-v-fdf25c25]{display:grid;gap:var(--spaceS);grid-auto-flow:column}.scrollable[data-v-fdf25c25]{box-shadow:inset 0 var(--spaceXS) 0 var(--colorShadow),inset 0 calc(var(--spaceXS)*-1) 0 var(--colorShadow);overflow-x:hidden;overflow-y:auto}";

const Layer_vue_vue_type_style_index_0_scoped_4936acab_lang = '.Layer[data-v-4936acab]{align-items:center;display:grid;grid-template-columns:auto 1fr auto}.Layer.active[data-v-4936acab]{background-color:var(--colorAccent);color:var(--colorTextAlt)}.Layer.invisible[data-v-4936acab]{opacity:.5}.actions[data-v-4936acab]{align-items:center;display:grid;grid-auto-flow:column}.name[data-v-4936acab]{font-weight:700;padding:var(--spaceS)}.preview[data-v-4936acab]{aspect-ratio:1;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA3SURBVHgB7dHBCQAwDAJAW7qR0zqUM7UbpI8QyCN+hUNwSboIYjuqsZHMAB2A8/uZJEoXDNABeAdlCFOqlI3sAAAAAElFTkSuQmCC");display:grid;overflow:hidden;place-items:stretch;width:4rem}canvas[data-v-4936acab]{height:auto;width:100%}';

const Layers_vue_vue_type_style_index_0_scoped_bf63d7ec_lang = ".layers[data-v-bf63d7ec]{display:flex;flex-direction:column-reverse;gap:var(--spaceS)}";

const LayerSettings_vue_vue_type_style_index_0_scoped_a83d2131_lang = ".layer-settings[data-v-a83d2131]{min-width:20rem;right:var(--widthSidebar);top:calc(var(--widthToolbar) + var(--spaceS))}.name[data-v-a83d2131]{align-items:center;display:grid;font-weight:700;gap:var(--spaceM);grid-template-columns:auto auto;height:var(--spaceXL);justify-content:start}.layer-visibility[data-v-a83d2131]{display:grid;gap:var(--spaceS);grid-template-columns:1fr auto}input[data-v-a83d2131]{width:100%}.actions[data-v-a83d2131]{display:grid;gap:var(--spaceS);grid-auto-flow:row}";

const Splash_vue_vue_type_style_index_0_scoped_616b9210_lang = ".wrapper[data-v-616b9210]{display:grid;inset:0;place-content:center;position:fixed;z-index:1000}.Splash[data-v-616b9210]{aspect-ratio:4/3;background-color:var(--colorAccent);box-shadow:var(--shadowLayer);display:grid;gap:var(--spaceM);grid-auto-flow:row;justify-content:stretch;padding:var(--spaceL) var(--spaceXL);width:33vw;z-index:1002}h1[data-v-616b9210]{color:var(--colorLayer0);font-size:6vw;line-height:1}";

const SymmetrySettings_vue_vue_type_style_index_0_scoped_e6bda572_lang = ".SymmetrySettings[data-v-e6bda572]{right:9rem;top:calc(var(--widthToolbar) + var(--spaceS))}";

const SettingsButton_vue_vue_type_style_index_0_scoped_9b19ec20_lang = ".menu[data-v-9b19ec20]{left:calc(var(--widthToolbar) + var(--spaceS));top:calc(var(--widthToolbar) + var(--spaceS))}";

const BrushSelector_vue_vue_type_style_index_0_scoped_484825ef_lang = ".BrushSelector[data-v-484825ef]{top:calc(var(--widthToolbar) + var(--spaceS))}";

const BrushSize_vue_vue_type_style_index_0_scoped_757379b2_lang = ".BrushSize[data-v-757379b2]{top:calc(var(--widthToolbar) + var(--spaceS))}";

const BrushDither_vue_vue_type_style_index_0_scoped_f7f63257_lang = ".BrushDither[data-v-f7f63257]{top:calc(var(--widthToolbar) + var(--spaceS))}";

const ToolSettingsShape_vue_vue_type_style_index_0_scoped_382406c5_lang = ".ToolSettingsShape[data-v-382406c5]{align-items:center;display:grid;gap:var(--spaceS);grid-auto-flow:column}";

const ToolSettingsTransform_vue_vue_type_style_index_0_scoped_8439e6ac_lang = ".tool-settings-transform[data-v-8439e6ac]{display:flex;gap:1rem}";

const ToolSettings_vue_vue_type_style_index_0_scoped_d81960ad_lang = ".ToolSettings[data-v-d81960ad]{align-items:center;display:grid;gap:var(--spaceM);grid-auto-flow:column}";

const Zoom_vue_vue_type_style_index_0_scoped_9d198216_lang = ".Zoom[data-v-9d198216]{align-items:center;display:grid;gap:var(--spaceS);grid-auto-flow:column}.percentage[data-v-9d198216]{text-align:center;width:7ch}.ZoomMenu[data-v-9d198216]{top:calc(var(--spaceS) + var(--widthToolbar))}";

const Settings_vue_vue_type_style_index_0_scoped_4cd26983_lang = ".Settings[data-v-4cd26983]{gap:var(--spaceS);height:100%;justify-content:space-between;padding:0 var(--spaceM)}.Settings[data-v-4cd26983],.group[data-v-4cd26983]{align-items:center;display:grid;grid-auto-flow:column}.group[data-v-4cd26983]{gap:var(--spaceM)}.group[data-v-4cd26983]:first-child{justify-content:start}.group[data-v-4cd26983]:last-child{justify-content:end}";

const Studio_client_vue_vue_type_style_index_0_scoped_674a5986_lang = ".CONTAINER[data-v-674a5986]{display:grid;grid-template-columns:var(--widthToolbar) 1fr var(--widthSidebar);grid-template-rows:var(--widthToolbar) 1fr auto;height:100svh;overflow:hidden;width:100svw}.ANIMATION[data-v-674a5986],.SETTINGS[data-v-674a5986],.TOOLS[data-v-674a5986]{background-color:var(--colorLayer1)}.SETTINGS[data-v-674a5986]{box-shadow:calc(var(--spaceXS)*-1) var(--spaceXS) 0 var(--colorShadow);grid-column:1/span 3;grid-row:1;z-index:3}.TOOLS[data-v-674a5986]{align-items:stretch;display:grid;grid-column:1;grid-row:2;z-index:2}.BOARD[data-v-674a5986]{background-color:var(--colorLayer0);cursor:url(" + buildAssetsURL("crosshair.d2c25dec.svg") + ") 12 12,auto;display:grid;grid-row:1/span 3;overflow:hidden;place-items:center;z-index:0}.ANIMATION[data-v-674a5986],.BOARD[data-v-674a5986]{grid-column:1/span 3}.ANIMATION[data-v-674a5986]{grid-row:3;position:relative;z-index:2}.PANELS[data-v-674a5986]{grid-column:3;grid-row:2;overflow:hidden;padding:var(--spaceS);pointer-events:none;position:relative;z-index:1}.button-show[data-v-674a5986]{background-color:var(--colorLayer1);box-shadow:calc(var(--spaceS)*-1) var(--spaceS) 0 var(--colorShadow);height:var(--spaceXL);left:50%;padding:0 var(--spaceL);position:absolute;top:0;transform:translate(-50%,calc(var(--spaceXL)*-1))}.button-show.expanded[data-v-674a5986]{box-shadow:none;transform:translate(-50%,calc(var(--spaceM)*-1))}";

const studioStyles_90d340c1 = [Toolbar_vue_vue_type_style_index_0_scoped_77e8e6ac_lang, IconDropdown_vue_vue_type_style_index_0_scoped_e51c54bf_lang, Button_vue_vue_type_style_index_0_scoped_15e75170_lang, ToolButton_vue_vue_type_style_index_0_scoped_6ff7d516_lang, Icon_vue_vue_type_style_index_0_scoped_bb65522d_lang, HuePicker_vue_vue_type_style_index_0_scoped_07dfe8dc_lang, CombinedColorPicker_vue_vue_type_style_index_0_scoped_aaf0e266_lang, ColorHex_vue_vue_type_style_index_0_scoped_a7b5fef2_lang, Field_vue_vue_type_style_index_0_scoped_f86c4382_lang, Slider_vue_vue_type_style_index_0_scoped_e180fd99_lang, ColorHSL_vue_vue_type_style_index_0_scoped_e56e07ba_lang, ColorRGB_vue_vue_type_style_index_0_scoped_1c055ddc_lang, PaletteColor_vue_vue_type_style_index_0_scoped_07c3557f_lang, Palette_vue_vue_type_style_index_0_scoped_31c2ffc0_lang, TabMenu_vue_vue_type_style_index_0_scoped_8f8e3c95_lang, Tab_vue_vue_type_style_index_0_scoped_5911a60c_lang, ColorPicker_vue_vue_type_style_index_0_scoped_a83b5552_lang, Divider_vue_vue_type_style_index_0_scoped_06a2d170_lang, Document_vue_vue_type_style_index_0_lang, Overlay_vue_vue_type_style_index_0_scoped_bc6cd314_lang, Modal_vue_vue_type_style_index_0_scoped_aca2b8ae_lang, Select_vue_vue_type_style_index_0_scoped_db5f5c69_lang, DocumentCreate_vue_vue_type_style_index_0_scoped_a506a0f7_lang, Selection_vue_vue_type_style_index_0_scoped_7c6a07a3_lang, Dropdown_vue_vue_type_style_index_0_scoped_4d7e60c6_lang, Panel_vue_vue_type_style_index_0_scoped_fdf25c25_lang, Layer_vue_vue_type_style_index_0_scoped_4936acab_lang, Layers_vue_vue_type_style_index_0_scoped_bf63d7ec_lang, LayerSettings_vue_vue_type_style_index_0_scoped_a83d2131_lang, Splash_vue_vue_type_style_index_0_scoped_616b9210_lang, SymmetrySettings_vue_vue_type_style_index_0_scoped_e6bda572_lang, SettingsButton_vue_vue_type_style_index_0_scoped_9b19ec20_lang, BrushSelector_vue_vue_type_style_index_0_scoped_484825ef_lang, BrushSize_vue_vue_type_style_index_0_scoped_757379b2_lang, BrushDither_vue_vue_type_style_index_0_scoped_f7f63257_lang, ToolSettingsShape_vue_vue_type_style_index_0_scoped_382406c5_lang, ToolSettingsTransform_vue_vue_type_style_index_0_scoped_8439e6ac_lang, ToolSettings_vue_vue_type_style_index_0_scoped_d81960ad_lang, Zoom_vue_vue_type_style_index_0_scoped_9d198216_lang, Settings_vue_vue_type_style_index_0_scoped_4cd26983_lang, Studio_client_vue_vue_type_style_index_0_scoped_674a5986_lang];

export { studioStyles_90d340c1 as default };
//# sourceMappingURL=studio-styles.90d340c1.mjs.map
