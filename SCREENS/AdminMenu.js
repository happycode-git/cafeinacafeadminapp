import { useEffect, useState } from "react";
import {
  AsyncImage,
  ButtonOne,
  ButtonTwo,
  CameraPicker,
  CheckboxOne,
  Grid,
  Icon,
  IconButtonOne,
  IconButtonTwo,
  RoundedCorners,
  SafeArea,
  SegmentedPicker,
  Spacer,
  SplitView,
  TextAreaOne,
  TextFieldOne,
  backgrounds,
  bus,
  colors,
  firebase_CreateDocument,
  firebase_DeleteDocument,
  firebase_GetAllDocuments,
  firebase_GetAllDocumentsListener,
  firebase_UpdateDocument,
  format,
  function_PickImage,
  height,
  layout,
  randomString,
  sizes,
  storage_GetImage,
  storage_UploadImage,
  width,
} from "../EVERYTHING/BAGEL/Things";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AdminMenuBar } from "../EVERYTHING/AdminMenuBar";

export function AdminMenu({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [chosenCat, setChosenCat] = useState("");
  const [showNewItem, setShowNewItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [toggleOptionForm, setToggleOptionForm] = useState(false);
  const [options, setOptions] = useState([]);
  const [image, setImage] = useState(null);
  const [imageMode, setImageMode] = useState("Portrait");
  const [showCamera, setShowCamera] = useState(false);
  const [chosenItem, setChosenItem] = useState({});
  const [editOption, setEditOption] = useState(false);
  const [chosenOptionID, setChosenOptionID] = useState("");
  const [showCounter, setShowCounter] = useState(false);
  //
  const [name, setName] = useState("");
  function onTypeName(text) {
    setName(text);
  }
  const [desc, setDesc] = useState("");
  function onTypeDesc(text) {
    setDesc(text);
  }
  const [price, setPrice] = useState("");
  function onTypePrice(text) {
    setPrice(text);
  }
  const [category, setCategory] = useState("");
  function onTypeCategory(text) {
    setCategory(text);
  }
  const [featured, setFeatured] = useState(false);
  const [out, setOut] = useState(false);
  //
  const [sub, setSub] = useState("");
  function onTypeSub(text) {
    setSub(text);
  }
  const [option, setOption] = useState("");
  function onTypeOption(text) {
    setOption(text);
  }
  const [amount, setAmount] = useState("");
  function onTypeAmount(text) {
    setAmount(text);
  }
  const [showAmount, setShowAmount] = useState(false);

  async function onCreateItem() {
    setShowNewItem(false);
    setLoading(true);
    const imagePath = `Images/${randomString(10)}.jpg`;
    const itemID = randomString(25);
    const args = {
      Category: category,
      Desc: desc.replaceAll("\n", "jjj"),
      Featured: featured,
      Out: out,
      ImagePath: imagePath,
      ImageMode: imageMode,
      Name: name,
      Price: parseFloat(price),
    };

    try {
      await storage_UploadImage(setLoading, image, imagePath);
      await firebase_CreateDocument(args, "Items", itemID);

      if (options.length > 0) {
        for (var i = 0; i < options.length; i += 1) {
          const opt = options[i];
          const args2 = {
            Amount: parseFloat(opt.Amount),
            Category: opt.Category,
            ItemID: itemID,
            Option: opt.Option,
            Order: opt.Order,
            ShowAmount: opt.ShowAmount,
            ShowCounter: opt.ShowCounter,
            Quantity: 1,
          };

          await firebase_CreateDocument(args2, "ItemOptions", randomString(25));

          if (i === options.length - 1) {
            setName("");
            setDesc("");
            setPrice("");
            setCategory("");
            setSub("");
            setOption("");
            setPrice("");
            setOptions([]);
            setImage(null);
            setChosenOptionID(false);
            setShowAmount(false);
            setShowCounter(false);
            setToggleOptionForm(false);
            setEditOption(false);
            setOptions([]);
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      setLoading(false);
    }
  }
  async function onUpdateItem() {
    setShowEditItem(false);
    setLoading(true);
    const itemID = chosenItem.id;
    const imagePath = `Images/${randomString(10)}.jpg`;
    const args = {
      Category: category,
      Desc: desc,
      Featured: featured,
      ImageMode: imageMode,
      ImagePath: imagePath,
      Name: name,
      Out: out,
      Price: parseFloat(price),
    };

    try {
      console.log(args);
      await storage_UploadImage(setLoading, image, imagePath);
      firebase_UpdateDocument(setLoading, "Items", itemID, args).then(() => {
        setLoading(true);
        if (options.length > 0) {
          // console.log(options)
          for (var i = 0; i < options.length; i += 1) {
            const opt = options[i];
            const argsTwo = {
              Amount: parseFloat(opt.Amount),
              Category: opt.Category,
              ItemID: itemID,
              Option: opt.Option,
              Order: i + 1,
              ShowAmount: opt.ShowAmount,
              ShowCounter: opt.ShowCounter,
              Quantity: 1,
            };

            firebase_CreateDocument(
              argsTwo,
              "ItemOptions",
              opt.id !== undefined ? opt.id : randomString(25)
            );
            setName("");
            setDesc("");
            setPrice("");
            setCategory("");
            setSub("");
            setOption("");
            setPrice("");
            setOptions([]);
            setImage(null);
            setShowAmount(false);
            setShowCounter(false);
            setChosenOptionID(false);
            setToggleOptionForm(false);
            setEditOption(false);
            setOptions([]);

            setLoading(false);
          }
        } else {
          console.log("NO OPTIONS");
          setLoading(false);
        }
      });
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      setLoading(false);
    }
  }
  function onRemoveItem() {
    Alert.alert("Remove Item", "Are you sure you want to remove this item", [
      { text: "Cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setShowEditItem(false);
          setLoading(true);
          firebase_DeleteDocument(setLoading, "Items", chosenItem.id).then(
            () => {
              if (options.length > 0) {
                for (var i = 0; i < options.length; i += 1) {
                  const opt = options[i];
                  setLoading(true);
                  firebase_DeleteDocument(
                    setLoading,
                    "ItemOptions",
                    opt.id
                  ).then(() => {
                    setLoading(false);
                  });
                }
              } else {
                setLoading(false);
              }
            }
          );
        },
      },
    ]);
  }
  async function onDuplicateItem() {
    setShowEditItem(false);
    setLoading(true);
    const imagePath = `Images/${randomString(10)}.jpg`;
    const itemID = randomString(25);
    const args = {
      Category: category,
      Desc: desc.replaceAll("\n", "jjj"),
      Featured: featured,
      Out: out,
      ImagePath: imagePath,
      ImageMode: imageMode,
      Name: `${name} copy`,
      Price: parseFloat(price),
    };

    try {
      await storage_UploadImage(setLoading, image, imagePath);
      await firebase_CreateDocument(args, "Items", itemID);

      if (options.length > 0) {
        for (var i = 0; i < options.length; i += 1) {
          const opt = options[i];
          const args2 = {
            Amount: opt.Amount,
            Category: opt.Category,
            ItemID: itemID,
            Option: opt.Option,
            Order: opt.Order,
            ShowAmount: opt.ShowAmount,
            ShowCounter: opt.ShowCounter,
            Quantity: 1,
          };

          await firebase_CreateDocument(args2, "ItemOptions", randomString(25));

          if (i === options.length - 1) {
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      setLoading(false);
    }
  }
  function onOpenMenu() {
    Alert.alert(
      "More Options",
      "Which action would you like to perform on this item?",
      [
        {
          text: "Duplicate",
          onPress: () => {
            onDuplicateItem();
          },
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            onRemoveItem();
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  }
  // const [things, setThings] = useState([])
  // function doTHing() {
  //   for (var i = 0; i < things.length; i += 1) {
  //     const thing = things[i]
  //     const thingID = thing.id
  //     console.log(thingID)
  //     firebase_UpdateDocument(setLoading, "ItemOptions", thingID, {ShowAmount: false})
  //   }
  // }

  useEffect(() => {
    setLoading(true);
    // firebase_GetAllDocuments(setLoading, "ItemOptions", setThings,0,"asc","Option","","","")
    firebase_GetAllDocumentsListener(
      setLoading,
      "Items",
      setItems,
      0,
      "asc",
      "Name",
      "",
      "",
      ""
    );
  }, []);

  return (
    <SafeArea
      loading={loading}
      statusBar={"light"}
      styles={[{ backgroundColor: "#0B1721" }]}
    >
      {/* <TouchableOpacity onPress={doTHing}>
        <Text style={[colors.white]}>Press Me</Text>
      </TouchableOpacity> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={[{ flex: 1 }]}>
          <View style={[layout.padding, layout.separate_horizontal]}>
            <Text style={[sizes.medium_text, colors.white]}>Menu</Text>
            <IconButtonTwo
              name={"menu-outline"}
              size={35}
              color={"white"}
              onPress={() => {
                setShowModal(true);
              }}
            />
          </View>

          {/* MENU */}
          <RoundedCorners
            topLeft={15}
            topRight={15}
            style={[layout.padding]}
            styles={[
              { backgroundColor: "#F2F3F7" },
              layout.padding,
              { flex: 1 },
            ]}
          >
            <SplitView leftSize={2} rightSize={4}>
              <View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View>
                    <Text style={[sizes.small_text]}>Categories</Text>
                  </View>
                  <Spacer height={15} />
                  <View>
                    {[...new Set(items.map((item) => item.Category))].map(
                      (cat, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => {
                            if (chosenCat === cat) {
                              setChosenCat("");
                            } else {
                              setChosenCat(cat);
                            }
                          }}
                          style={[
                            layout.padding,
                            { backgroundColor: "rgba(0,0,0,0.1)" },
                          ]}
                        >
                          <Text style={[sizes.xsmall_text]}>{cat}</Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </ScrollView>
              </View>
              <View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={[layout.separate_horizontal]}>
                    <Text style={[sizes.small_text]}>Items</Text>
                    <ButtonOne
                      backgroundColor={"#117DFA"}
                      radius={100}
                      onPress={() => {
                        setImage(null);
                        setShowNewItem(true);
                      }}
                      padding={2}
                      styles={[
                        layout.horizontal,
                        {
                          alignItems: "center",
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                        },
                      ]}
                    >
                      <Icon name={"add-outline"} size={20} color={"white"} />
                      <Text style={[colors.white, { fontSize: 10 }]}>
                        Add Item
                      </Text>
                    </ButtonOne>
                  </View>
                  <Spacer height={15} />
                  <View>
                    {chosenCat !== "" && (
                      <Grid columns={3} styles={[{ marginHorizontal: 2 }]}>
                        {items
                          .filter((i) => i.Category === chosenCat)
                          .map((item, i) => (
                            <TouchableOpacity
                              key={i}
                              style={[layout.padding_horizontal_small]}
                              onPress={() => {
                                firebase_GetAllDocumentsListener(
                                  setLoading,
                                  "ItemOptions",
                                  setOptions,
                                  0,
                                  "asc",
                                  "Order",
                                  "ItemID",
                                  "==",
                                  item.id
                                );
                                storage_GetImage(
                                  setLoading,
                                  item.ImagePath,
                                  setImage
                                ).then(() => {
                                  setImageMode(item.ImageMode);
                                  setName(item.Name);
                                  setDesc(item.Desc);
                                  setPrice(item.Price.toString());
                                  setCategory(item.Category);
                                  setFeatured(item.Featured);
                                  setOut(item.Out);
                                  setChosenItem(item);
                                  setShowEditItem(true);
                                });
                              }}
                            >
                              <View style={[{ width: "auto" }]}>
                                <AsyncImage
                                  path={item.ImagePath}
                                  width={"auto"}
                                  height={height * 0.32}
                                />
                              </View>
                              <View style={[layout.padding_vertical_small]}>
                                <Text style={[sizes.xsmall_text]}>
                                  {item.Name}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                      </Grid>
                    )}
                  </View>
                </ScrollView>
              </View>
            </SplitView>
          </RoundedCorners>

          {/* MODALS */}
          <Modal
            visible={showEditItem}
            animationType="slide"
            onDismiss={() => {
              setName("");
              setDesc("");
              setPrice("");
              setCategory("");
              setSub("");
              setOption("");
              setPrice("");
              setShowCounter(false);
              setShowAmount(false);
              setOptions([]);
              setEditOption(false);
              setChosenOptionID(false);
              setImage(null);
            }}
          >
            <View style={[layout.padding, { flex: 1 }]}>
              <View style={[layout.separate_horizontal]}>
                <Text style={[{ fontSize: 18 }]}>Edit Item Form</Text>
                <View
                  style={[
                    layout.horizontal,
                    layout.padding_vertical,
                    { alignItems: "center" },
                  ]}
                >
                  <IconButtonOne
                    name={"ellipsis-horizontal"}
                    size={20}
                    onPress={onOpenMenu}
                    padding={6}
                  />

                  {name !== "" &&
                    price !== "" &&
                    category !== "" &&
                    image !== null && (
                      <ButtonOne
                        radius={100}
                        styles={[
                          layout.horizontal,
                          {
                            alignItems: "center",
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                          },
                        ]}
                        backgroundColor={"#117DFA"}
                        onPress={onUpdateItem}
                        padding={2}
                      >
                        <Icon
                          name="checkmark-outline"
                          size={18}
                          color={"white"}
                        />
                        <Text style={[colors.white, { fontSize: 10 }]}>
                          Update
                        </Text>
                      </ButtonOne>
                    )}
                  <IconButtonOne
                    name={"close-outline"}
                    size={18}
                    padding={8}
                    onPress={() => {
                      setName("");
                      setDesc("");
                      setPrice("");
                      setCategory("");
                      setSub("");
                      setOption("");
                      setPrice("");
                      setOptions([]);
                      setImage(null);
                      setShowAmount(false);
                      setShowCounter(false);
                      setChosenOptionID(false);
                      setToggleOptionForm(false);
                      setEditOption(false);
                      setOptions([]);
                      setShowEditItem(false);
                    }}
                  />
                </View>
              </View>
              <SplitView leftSize={3} rightSize={4}>
                {/* LEFT */}
                <View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[{ fontSize: 14 }]}>Item Details</Text>
                    <Spacer height={15} />
                    <View style={[layout.vertical]}>
                      <View>
                        <Text style={[sizes.xsmall_text]}>Item Name</Text>
                        <TextFieldOne
                          placeholder={"Item Name"}
                          onTyping={onTypeName}
                          value={name}
                          textSize={12}
                          styles={[
                            { paddingVertical: 6, paddingHorizontal: 12 },
                          ]}
                        />
                      </View>
                      <View>
                        <Text style={[sizes.xsmall_text]}>Description</Text>
                        <TextAreaOne
                          placeholder={"Description"}
                          onTyping={onTypeDesc}
                          value={desc}
                          textSize={12}
                          styles={[
                            { paddingVertical: 6, paddingHorizontal: 12 },
                          ]}
                        />
                      </View>
                      <View>
                        <Text style={[sizes.xsmall_text]}>Base Price</Text>
                        <TextFieldOne
                          placeholder={"Base Price $"}
                          onTyping={onTypePrice}
                          isNum={true}
                          value={price}
                          textSize={12}
                          styles={[
                            { paddingVertical: 6, paddingHorizontal: 12 },
                          ]}
                        />
                      </View>
                      <View>
                        <Text style={[sizes.xsmall_text]}>Category</Text>
                        <TextFieldOne
                          placeholder={"Category"}
                          onTyping={onTypeCategory}
                          value={category}
                          textSize={12}
                          styles={[
                            { paddingVertical: 6, paddingHorizontal: 12 },
                          ]}
                        />
                      </View>
                      <CheckboxOne
                        setter={setFeatured}
                        text={"Featured?"}
                        value={featured}
                      />
                      <CheckboxOne
                        setter={setOut}
                        text={"Is this item sold out?"}
                        value={out}
                      />
                    </View>
                    <Spacer height={15} />
                    <Text style={[{ fontSize: 14 }]}>Options</Text>
                    <Text style={[{ fontSize: 12 }]}>
                      Use this section to create options for your item. The
                      amount entered will be used to adjust the price. Enter the
                      amount you want to add or subtract from the base price
                    </Text>
                    <Text style={[{ color: "rgba(0,0,0,0.7)", fontSize: 12 }]}>
                      For Example: Sizes, Extras, etc.
                    </Text>
                    <Spacer height={15} />
                    <View>
                      {toggleOptionForm && (
                        <View style={[layout.padding_vertical]}>
                          <View>
                            <Text
                              style={[
                                layout.padding_vertical_small,
                                { fontSize: 12 },
                              ]}
                            >
                              Sub Category
                            </Text>
                            <TextFieldOne
                              placeholder={"Size, Cream, Roast Type, etc.."}
                              onTyping={onTypeSub}
                              textSize={12}
                              styles={[
                                { paddingVertical: 6, paddingHorizontal: 12 },
                              ]}
                              value={sub}
                            />
                          </View>
                          <SplitView leftSize={1} rightSize={1}>
                            <View>
                              <Text
                                style={[
                                  layout.padding_vertical_small,
                                  { fontSize: 12 },
                                ]}
                              >
                                Option Name
                              </Text>
                              <TextFieldOne
                                placeholder={"Small, No Cream, etc.."}
                                onTyping={onTypeOption}
                                textSize={12}
                                styles={[
                                  { paddingVertical: 6, paddingHorizontal: 12 },
                                ]}
                                value={option}
                              />
                            </View>
                            <View>
                              <Text
                                style={[
                                  layout.padding_vertical_small,
                                  { fontSize: 12 },
                                ]}
                              >
                                Adjusted Amount
                              </Text>
                              <View style={[layout.horizontal]}>
                                <Text
                                  style={[sizes.medium_text, { fontSize: 16 }]}
                                >
                                  $
                                </Text>
                                <TextFieldOne
                                  placeholder={"0.50 or -0.50.."}
                                  onTyping={onTypeAmount}
                                  isNum={true}
                                  textSize={12}
                                  styles={[
                                    {
                                      paddingVertical: 6,
                                      paddingHorizontal: 12,
                                    },
                                  ]}
                                  value={amount}
                                />
                              </View>
                            </View>
                          </SplitView>
                          <View style={[layout.padding]}>
                            <CheckboxOne
                              setter={setShowAmount}
                              value={showAmount}
                              text={"Display amount to customer"}
                              textSize={14}
                            />
                          </View>
                          <View style={[layout.padding_horizontal]}>
                            <CheckboxOne
                              setter={setShowCounter}
                              value={showCounter}
                              text={"Show counter for option"}
                              textSize={14}
                            />
                          </View>
                        </View>
                      )}
                      {!editOption && (
                        <ButtonOne
                          radius={10}
                          onPress={() => {
                            if (toggleOptionForm) {
                              if (
                                sub !== "" &&
                                option !== "" &&
                                amount !== ""
                              ) {
                                const itemID = chosenItem.id;
                                const optID = randomString(25);
                                const tempOpt = {
                                  Option: option,
                                  Amount: parseFloat(amount),
                                  Category: sub,
                                  ItemID: itemID,
                                  Order: options.length + 1,
                                  ShowAmount: showAmount,
                                  ShowCounter: showCounter,
                                  Quantity: 1,
                                };
                                firebase_CreateDocument(
                                  tempOpt,
                                  "ItemOptions",
                                  optID
                                );
                                console.log(tempOpt);
                                setAmount("");
                                setSub("");
                                setOption("");
                                setShowAmount(false);
                                setToggleOptionForm(false);
                              } else {
                                Alert.alert(
                                  "Missing Info",
                                  "Please fill out all fields to continue."
                                );
                              }
                            } else {
                              setToggleOptionForm(true);
                            }
                          }}
                          padding={8}
                        >
                          <Text
                            style={[
                              colors.white,
                              format.center_text,
                              { fontSize: 12 },
                            ]}
                          >
                            Add Option
                          </Text>
                        </ButtonOne>
                      )}
                      {editOption && (
                        <ButtonOne
                          radius={10}
                          onPress={() => {
                            if (sub !== "" && option !== "" && amount !== "") {
                              // console.log(chosenOptionID)
                              const opt = {
                                Option: option,
                                Amount: parseFloat(amount),
                                Category: sub,
                                ShowAmount: showAmount,
                                ShowCounter: showCounter,
                                Quantity: 1,
                              };
                              firebase_UpdateDocument(
                                setLoading,
                                "ItemOptions",
                                chosenOptionID,
                                opt
                              );
                              setAmount("");
                              setSub("");
                              setOption("");
                              setChosenOptionID("");
                              setShowAmount(false);
                              setEditOption(false);
                              setShowCounter(false);
                              setToggleOptionForm(false);
                            } else {
                              Alert.alert(
                                "Missing Info",
                                "Please fill out all fields to continue."
                              );
                            }
                          }}
                          padding={8}
                        >
                          <Text
                            style={[
                              colors.white,
                              format.center_text,
                              { fontSize: 12 },
                            ]}
                          >
                            Update Option
                          </Text>
                        </ButtonOne>
                      )}
                      <View style={[layout.padding_vertical]}>
                        {options.map((opt, i) => {
                          return (
                            <TouchableOpacity
                              key={i}
                              style={[layout.separate_horizontal]}
                              onPress={() => {
                                setChosenOptionID(opt.id);
                                setSub(opt.Category);
                                setAmount(opt.Amount.toString());
                                setOption(opt.Option);
                                setShowAmount(opt.ShowAmount);
                                setShowCounter(opt.ShowCounter);
                                setEditOption(true);
                                setToggleOptionForm(true);
                              }}
                            >
                              <Text style={[{ fontSize: 12 }]}>
                                {opt.Category}
                              </Text>
                              <View style={[layout.horizontal]}>
                                <Text style={[{ fontSize: 12 }]}>
                                  {opt.Option}
                                </Text>
                                <Text style={[{ fontSize: 12 }]}>
                                  {opt.Amount >= 0 ? "+" : "-"} $
                                  {Math.abs(parseFloat(opt.Amount)).toFixed(2)}
                                </Text>
                                <IconButtonTwo
                                  name="close"
                                  color="red"
                                  size={18}
                                  onPress={() => {
                                    firebase_DeleteDocument(
                                      setLoading,
                                      "ItemOptions",
                                      opt.id
                                    );
                                  }}
                                />
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                    <Spacer height={100} />
                  </ScrollView>
                </View>
                {/* RIGHT */}
                <View>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={[{ marginBottom: width * 0.06 }]}
                  >
                    <View>
                      <View
                        style={[layout.horizontal, { alignItems: "center" }]}
                      >
                        <ButtonOne
                          radius={100}
                          backgroundColor={
                            imageMode === "Portrait"
                              ? "black"
                              : "rgba(0,0,0,0.05)"
                          }
                          onPress={() => {
                            setImageMode("Portrait");
                          }}
                          padding={2}
                          styles={[
                            { paddingVertical: 8, paddingHorizontal: 16 },
                          ]}
                        >
                          <Text
                            style={[
                              imageMode === "Portrait"
                                ? colors.white
                                : colors.black,
                              { fontSize: 12 },
                            ]}
                          >
                            Portrait
                          </Text>
                        </ButtonOne>
                        <ButtonOne
                          radius={100}
                          backgroundColor={
                            imageMode === "Landscape"
                              ? "black"
                              : "rgba(0,0,0,0.05)"
                          }
                          onPress={() => {
                            setImageMode("Landscape");
                          }}
                          styles={[
                            { paddingVertical: 8, paddingHorizontal: 16 },
                          ]}
                        >
                          <Text
                            style={[
                              imageMode === "Landscape"
                                ? colors.white
                                : colors.black,
                              { fontSize: 12 },
                            ]}
                          >
                            Landscape
                          </Text>
                        </ButtonOne>
                      </View>
                      <Spacer height={15} />
                      <View>
                        {image !== null && (
                          <Image
                            source={{ uri: image }}
                            width={
                              imageMode === "Portrait"
                                ? width * 0.3
                                : width * 0.5
                            }
                            height={
                              imageMode === "Portrait"
                                ? width * 0.35
                                : width * 0.35
                            }
                            style={[
                              layout.center_horizontal,
                              format.radius,
                              layout.image_cover,
                            ]}
                          />
                        )}
                      </View>
                      <View
                        style={[
                          layout.horizontal,
                          { alignItems: "center" },
                          layout.padding_vertical,
                          layout.center_horizontal,
                        ]}
                      >
                        <ButtonOne
                          radius={10}
                          onPress={() => {
                            setShowCamera(true);
                          }}
                          padding={8}
                          styles={[{ paddingHorizontal: 14 }]}
                        >
                          <Text
                            style={[
                              format.center_text,
                              colors.white,
                              { fontSize: 12 },
                            ]}
                          >
                            Take Photo
                          </Text>
                        </ButtonOne>

                        <ButtonTwo
                          radius={10}
                          onPress={() => {
                            function_PickImage(setLoading, setImage);
                          }}
                          padding={8}
                          styles={[{ paddingHorizontal: 14 }]}
                        >
                          <Text style={[format.center_text, { fontSize: 12 }]}>
                            Choose Photo
                          </Text>
                        </ButtonTwo>
                      </View>
                    </View>
                    <Spacer height={100} />
                  </ScrollView>
                </View>
              </SplitView>
            </View>
            {showCamera && (
              <CameraPicker
                setToggle={setShowCamera}
                setImage={setImage}
                setLoading={setLoading}
              />
            )}
          </Modal>
          {/* NEW ITEM */}
          <Modal
            visible={showNewItem}
            animationType="slide"
            onDismiss={() => {
              setName("");
              setDesc("");
              setPrice("");
              setCategory("");
              setSub("");
              setOption("");
              setPrice("");
              setOptions([]);
              setImage(null);
              setShowCounter(false);
              setToggleOptionForm(false);
            }}
          >
            <SafeArea>
              <View style={[layout.padding, { flex: 1 }]}>
                <View style={[layout.separate_horizontal]}>
                  <Text style={[sizes.large_text]}>Add Item Form</Text>
                  <View style={[layout.horizontal, { alignItems: "center" }]}>
                    {name !== "" &&
                      price !== "" &&
                      category !== "" &&
                      image !== null && (
                        <ButtonOne
                          radius={100}
                          styles={[
                            layout.horizontal,
                            {
                              alignItems: "center",
                              paddingVertical: 10,
                              paddingHorizontal: 12,
                            },
                          ]}
                          backgroundColor={"#117DFA"}
                          onPress={onCreateItem}
                        >
                          <Icon
                            name="checkmark-outline"
                            size={16}
                            color={"white"}
                          />
                          <Text style={[colors.white, { fontSize: 12 }]}>
                            Create Item
                          </Text>
                        </ButtonOne>
                      )}
                    <IconButtonOne
                      name={"close-outline"}
                      size={18}
                      onPress={() => {
                        setName("");
                        setDesc("");
                        setPrice("");
                        setCategory("");
                        setSub("");
                        setOption("");
                        setPrice("");
                        setOptions([]);
                        setImage(null);
                        setToggleOptionForm(false);
                        setShowNewItem(false);
                        setShowCounter(false);
                      }}
                    />
                  </View>
                </View>
                <SplitView leftSize={2} rightSize={4}>
                  {/* LEFT */}
                  <View>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      style={[{ marginBottom: width * 0.03 }]}
                    >
                      <Text style={[sizes.small_text]}>Item Details</Text>
                      <Spacer height={15} />
                      <View style={[layout.vertical]}>
                        <View>
                          <Text style={[sizes.xsmall_text]}>Item Name</Text>
                          <TextFieldOne
                            placeholder={"Item Name"}
                            onTyping={onTypeName}
                            autoCap={true}
                            styles={[sizes.xsmall_text, { paddingVertical: 8 }]}
                          />
                        </View>
                        <View>
                          <Text style={[sizes.xsmall_text]}>Description</Text>
                          <TextAreaOne
                            placeholder={"Description"}
                            onTyping={onTypeDesc}
                            styles={[sizes.xsmall_text, { paddingVertical: 0 }]}
                          />
                        </View>
                        <View>
                          <Text style={[sizes.xsmall_text]}>Base Price</Text>
                          <TextFieldOne
                            placeholder={"Base Price $"}
                            onTyping={onTypePrice}
                            styles={[sizes.xsmall_text, { paddingVertical: 8 }]}
                            isNum={true}
                          />
                        </View>
                        <View>
                          <Text style={[sizes.xsmall_text]}>Category</Text>
                          <TextFieldOne
                            placeholder={"Category"}
                            onTyping={onTypeCategory}
                            autoCap={true}
                            styles={[sizes.xsmall_text, { paddingVertical: 8 }]}
                          />
                        </View>
                        <CheckboxOne
                          setter={setFeatured}
                          text={"Featured?"}
                          value={featured}
                          textSize={14}
                        />
                        <CheckboxOne
                          setter={setOut}
                          text={"Is this item sold out?"}
                          value={out}
                          textSize={14}
                        />
                      </View>
                      <Spacer height={15} />
                      <Text style={[sizes.small_text]}>Options</Text>
                      <Text style={[sizes.xsmall_text]}>
                        Use this section to create options for your item. The
                        amount entered will be used to adjust the price. Enter
                        the amount you want to add or subtract from the base
                        price
                      </Text>
                      <Text
                        style={[
                          { color: "rgba(0,0,0,0.7)" },
                          sizes.xsmall_text,
                        ]}
                      >
                        For Example: Sizes, Extras, etc.
                      </Text>
                      <Spacer height={15} />
                      <View>
                        {toggleOptionForm && (
                          <View style={[layout.padding_vertical]}>
                            <View>
                              <Text style={[layout.padding_vertical_small]}>
                                Sub Category
                              </Text>
                              <TextFieldOne
                                placeholder={"Size, Cream, Roast Type, etc.."}
                                onTyping={onTypeSub}
                                autoCap={true}
                                textSize={12}
                                styles={[{ paddingVertical: 8 }]}
                              />
                            </View>
                            <SplitView leftSize={1} rightSize={1}>
                              <View>
                                <Text style={[layout.padding_vertical_small]}>
                                  Option Name
                                </Text>
                                <TextFieldOne
                                  placeholder={"Small, No Cream, etc.."}
                                  onTyping={onTypeOption}
                                  autoCap={true}
                                  textSize={12}
                                  styles={[{ paddingVertical: 8 }]}
                                />
                              </View>
                              <View>
                                <Text style={[layout.padding_vertical_small]}>
                                  Adjusted Amount
                                </Text>
                                <View style={[layout.horizontal]}>
                                  <Text style={[sizes.medium_text]}>$</Text>
                                  <TextFieldOne
                                    placeholder={"0.50 or -0.50.."}
                                    onTyping={onTypeAmount}
                                    isNum={true}
                                    textSize={12}
                                    styles={[{ paddingVertical: 8 }]}
                                  />
                                </View>
                              </View>
                            </SplitView>
                            <View style={[layout.padding]}>
                              <CheckboxOne
                                setter={setShowAmount}
                                value={showAmount}
                                text={"Display amount to customer"}
                              />
                            </View>
                            <View style={[layout.padding_horizontal]}>
                              <CheckboxOne
                                setter={setShowCounter}
                                value={showCounter}
                                text={"Show counter for option"}
                              />
                            </View>
                          </View>
                        )}
                        <ButtonOne
                          radius={10}
                          onPress={() => {
                            if (toggleOptionForm) {
                              if (
                                sub !== "" &&
                                option !== "" &&
                                amount !== ""
                              ) {
                                const itemID = randomString(25);
                                const opt = {
                                  Option: option,
                                  Amount: amount,
                                  Category: sub,
                                  ItemID: itemID,
                                  Order: options.length + 1,
                                  ShowAmount: showAmount,
                                  ShowCounter: showCounter,
                                  Quantity: 1,
                                };
                                setSub("");
                                setAmount("");
                                setOption("");
                                setShowAmount(false);
                                setShowCounter(false);
                                setOptions([...options, opt]);
                                setToggleOptionForm(false);
                              } else if (
                                sub !== "" ||
                                option !== "" ||
                                amount !== ""
                              ) {
                                Alert.alert(
                                  "Missing Info",
                                  "Please fill out all fields to add this option."
                                );
                              } else {
                                setToggleOptionForm(false);
                              }
                            } else {
                              setToggleOptionForm(true);
                            }
                          }}
                          styles={[{ paddingVertical: 8 }]}
                        >
                          <Text style={[colors.white, format.center_text]}>
                            {toggleOptionForm &&
                            sub === "" &&
                            option === "" &&
                            amount === ""
                              ? "Close"
                              : "Add Option"}
                          </Text>
                        </ButtonOne>
                        <View style={[layout.padding_vertical]}>
                          {options.map((opt, i) => {
                            return (
                              <View
                                key={i}
                                style={[layout.separate_horizontal]}
                              >
                                <Text style={[{ fontSize: 14 }]}>
                                  {opt.Category}
                                </Text>
                                <View style={[layout.horizontal]}>
                                  <Text style={[{ fontSize: 14 }]}>
                                    {opt.Option}
                                  </Text>
                                  <Text style={[{ fontSize: 14 }]}>
                                    {opt.Amount >= 0 ? "+" : "-"} $
                                    {Math.abs(parseFloat(opt.Amount)).toFixed(
                                      2
                                    )}
                                  </Text>
                                  <IconButtonTwo
                                    name="close"
                                    color="red"
                                    size={20}
                                    onPress={() => {
                                      const newArr = options.filter(
                                        (op) => op.id !== opt.id
                                      );
                                      setOptions(newArr);
                                    }}
                                  />
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                      <Spacer height={100} />
                    </ScrollView>
                  </View>
                  {/* RIGHT */}
                  <View>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      style={[{ marginBottom: width * 0.06 }]}
                    >
                      <View>
                        <View
                          style={[layout.horizontal, { alignItems: "center" }]}
                        >
                          <ButtonOne
                            radius={100}
                            backgroundColor={
                              imageMode === "Portrait"
                                ? "black"
                                : "rgba(0,0,0,0.05)"
                            }
                            onPress={() => {
                              setImageMode("Portrait");
                            }}
                            padding={2}
                            styles={[
                              { paddingVertical: 8, paddingHorizontal: 16 },
                            ]}
                          >
                            <Text
                              style={[
                                imageMode === "Portrait"
                                  ? colors.white
                                  : colors.black,
                                { fontSize: 12 },
                              ]}
                            >
                              Portrait
                            </Text>
                          </ButtonOne>
                          <ButtonOne
                            radius={100}
                            backgroundColor={
                              imageMode === "Landscape"
                                ? "black"
                                : "rgba(0,0,0,0.05)"
                            }
                            onPress={() => {
                              setImageMode("Landscape");
                            }}
                            styles={[
                              { paddingVertical: 8, paddingHorizontal: 16 },
                            ]}
                          >
                            <Text
                              style={[
                                imageMode === "Landscape"
                                  ? colors.white
                                  : colors.black,
                                { fontSize: 12 },
                              ]}
                            >
                              Landscape
                            </Text>
                          </ButtonOne>
                        </View>
                        <Spacer height={15} />
                        <View>
                          {image !== null && (
                            <Image
                              source={{ uri: image }}
                              width={
                                imageMode === "Portrait"
                                  ? width * 0.3
                                  : width * 0.5
                              }
                              height={
                                imageMode === "Portrait"
                                  ? width * 0.35
                                  : width * 0.35
                              }
                              style={[
                                layout.center_horizontal,
                                format.radius,
                                layout.image_cover,
                              ]}
                            />
                          )}
                        </View>
                        <View
                          style={[
                            layout.horizontal,
                            { alignItems: "center" },
                            layout.padding_vertical,
                            layout.center_horizontal,
                          ]}
                        >
                          <ButtonOne
                            radius={10}
                            onPress={() => {
                              setShowCamera(true);
                            }}
                            padding={8}
                            styles={[{ paddingHorizontal: 14 }]}
                          >
                            <Text
                              style={[
                                format.center_text,
                                colors.white,
                                { fontSize: 12 },
                              ]}
                            >
                              Take Photo
                            </Text>
                          </ButtonOne>

                          <ButtonTwo
                            radius={10}
                            onPress={() => {
                              function_PickImage(setLoading, setImage);
                            }}
                            padding={8}
                            styles={[{ paddingHorizontal: 14 }]}
                          >
                            <Text
                              style={[format.center_text, { fontSize: 12 }]}
                            >
                              Choose Photo
                            </Text>
                          </ButtonTwo>
                        </View>
                      </View>
                      <Spacer height={100} />
                    </ScrollView>
                  </View>
                </SplitView>
              </View>
            </SafeArea>
            {showCamera && (
              <CameraPicker
                setToggle={setShowCamera}
                setImage={setImage}
                setLoading={setLoading}
              />
            )}
          </Modal>
          <Modal visible={showModal} animationType="slide">
            {/* INSERT ADMIN MENU HERE */}
            <AdminMenuBar
              bus={bus}
              navigation={navigation}
              route={route}
              setToggle={setShowModal}
            />
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
