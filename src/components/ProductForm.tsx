import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
	name: yup.string().required("Product name is required"),
	price: yup.number().required("Price is required").positive(),
	stock: yup.number().required("Stock is required").min(0),
});

export type ProductFormValues = {
	name: string;
	price: number;
	stock: number;
	image?: any;
};

type Props = {
	initialValues?: Partial<ProductFormValues>;
	onSubmit: (data: ProductFormValues, image: any) => Promise<void>;
	submitLabel?: string;
};

export default function ProductForm({
	initialValues = {},
	onSubmit,
	submitLabel = "Save",
}: Props) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ProductFormValues>({
		defaultValues: {
			name: initialValues.name || "",
			price: initialValues.price || 0,
			stock: initialValues.stock || 0,
		},
		resolver: yupResolver(schema),
	});

	const [image, setImage] = useState<any>(initialValues.image || null);
	const [loading, setLoading] = useState(false);

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 0.7,
		});

		if (!result.canceled) {
			setImage(result.assets[0]);
		}
	};

	const submit = async (data: ProductFormValues) => {
		setLoading(true);
		await onSubmit(data, image);
		setLoading(false);
	};

	return (
		<View style={ { padding: 20 } }>
			<Controller
				control={ control }
				name="name"
				render={ ({ field: { value, onChange } }) => (
					<TextInput
						label="Product Name"
						mode="outlined"
						value={ value }
						onChangeText={ onChange }
						style={ { marginBottom: 10 } }
					/>
				) }
			/>
			{ errors.name && <Text style={ { color: "red" } }>{ errors.name.message }</Text> }

			<Controller
				control={ control }
				name="price"
				render={ ({ field: { value, onChange } }) => (
					<TextInput
						label="Price"
						mode="outlined"
						keyboardType="numeric"
						value={ String(value) }
						onChangeText={ (text) => onChange(Number(text)) }
						style={ { marginBottom: 10 } }
					/>
				) }
			/>
			{ errors.price && <Text style={ { color: "red" } }>{ errors.price.message }</Text> }

			<Controller
				control={ control }
				name="stock"
				render={ ({ field: { value, onChange } }) => (
					<TextInput
						label="Stock"
						mode="outlined"
						keyboardType="numeric"
						value={ String(value) }
						onChangeText={ (text) => onChange(Number(text)) }
						style={ { marginBottom: 10 } }
					/>
				) }
			/>
			{ errors.stock && <Text style={ { color: "red" } }>{ errors.stock.message }</Text> }

			<TouchableOpacity
				onPress={ pickImage }
				style={ { alignItems: "center", marginVertical: 10 } }
			>
				{ image ? (
					<Image
						source={ { uri: image.uri } }
						style={ { width: 120, height: 120, borderRadius: 8 } }
					/>
				) : (
					<Button mode="outlined">Select Image</Button>
				) }
			</TouchableOpacity>

			<Button mode="contained" onPress={ handleSubmit(submit) } loading={ loading }>
				{ submitLabel }
			</Button>
		</View>
	);
}
