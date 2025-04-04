const Palette = {
	Green: Color3.fromRGB(48, 222, 156),
	Blue: Color3.fromRGB(105, 181, 255)
};

const Dark = {
	PureColor: {
		Color: Color3.fromRGB(36, 36, 36),
		Inverse: new Color3(1, 1, 1)
	},
	Text: {
		Color: Color3.fromRGB(255, 255, 255),
		Disabled: Color3.fromRGB(150, 150, 150),
		Inverted: Color3.fromRGB(38, 38, 38)
	},
	Icon: {
		Color: Color3.fromRGB(255, 255, 255),
		Active: Palette.Blue,
		Disabled: Color3.fromRGB(102, 102, 102)
	},
	Divisor: {
		Color: Color3.fromRGB(150, 150, 150),
		Transparency: 0.7
	},
	Topbar: {
		Color: Color3.fromRGB(33, 33, 59),
		Logo: Color3.fromRGB(222, 148, 250),
		CanaryGear: Color3.fromRGB(186, 238, 128)
	},
	Search: {
		Color: Color3.fromRGB(49, 49, 53),
		Placeholder: Color3.fromRGB(161, 161, 161)
	},
	SidePanel: Color3.fromRGB(26, 28, 31),
	StoryPanel: {
		Color: Color3.fromRGB(18, 20, 24),
		PatternColor: Color3.fromRGB(255, 255, 255),
		PatternTransparency: 0.97
	},
	ActionsPanel: {
		Color: Color3.fromRGB(33, 33, 33),
		TabsBackground: Color3.fromRGB(43, 43, 43),
		TabHover: Color3.fromRGB(56, 56, 56)
	},
	StoryPreview: {
		Background: Color3.fromRGB(26, 28, 31),
		Color: Color3.fromRGB(79, 79, 79),
		Selected: Palette.Blue,
		TextSelected: Color3.fromRGB(27, 37, 48),
		CloseButton: Color3.fromRGB(255, 255, 255),
		InfoToast: Color3.fromRGB(79, 79, 79)
	},
	//NODES
	Normal: {
		Color: Color3.fromRGB(82, 82, 92),
		StoryIcon: Color3.fromRGB(120, 189, 232),
		FolderIcon: Color3.fromRGB(237, 166, 222),
		Book: Color3.fromRGB(143, 240, 176)
	},
	StorySelected: {
		Color: Palette.Blue,
		StoryIcon: Color3.fromRGB(15, 23, 31)
	},

	ResizePanelDrag: Color3.fromRGB(92, 181, 255),
	ColorPicker: {
		Background: Color3.fromRGB(24, 24, 24),
		Handle: Color3.fromRGB(255, 255, 255)
	},
	Dropdown: {
		Color: Color3.fromRGB(22, 22, 22),
		TextHover: Color3.fromRGB(255, 255, 255)
	},
	//CONTROLS
	Boolean: {
		SwitchOn: Palette.Green,
		SwitchOff: Color3.fromRGB(56, 56, 56),
		SwitchBackOn: Color3.fromRGB(166, 166, 166),
		SwitchBackOff: Color3.fromRGB(166, 166, 166)
	},
	List: {
		Frame: Color3.fromRGB(48, 48, 48),
		FrameHovered: Color3.fromRGB(66, 66, 66)
	}
};

export default Dark;
