import SvgIcon from "./SvgIcon";

import Backdrop from "./Backdrop";

import Typography from "./Typography";

import CssBaseline from "./CssBaseline";

import Button from "./Button";
import Menu from "./Menu";
import Tabs from "./Tabs";
import Select from "./Select";
import AutoComplete from "./AutoComplete";
import InputBase from "./InputBase";
import Checkbox from "./Checkbox";
import Paper from "./Paper";
import Avatar from "./Avatar";
import TextField from "./TextField";
import ToolTip from "./ToolTip";

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
    return Object.assign(
        Menu(theme),
        Typography(theme),
        CssBaseline(theme),
        SvgIcon(theme),
        Backdrop(theme),
        Button(theme),
        Tabs(theme),
        Select(theme),
        AutoComplete(theme),
        InputBase(theme),
        Checkbox(theme),
        Paper(theme),
        Avatar(theme),
        TextField(theme),
        ToolTip(theme)
    );
}
