// prettier-ignore
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Svg,
    Line,
    Font,
    Image,
} from "@react-pdf/renderer";
import {
    MonumentTypes,
    People,
    StationData,
    StationImagesData,
    StationInfoData,
    StationMetadataServiceData,
} from "@types";
import { decimalToDMS, formattedDates } from "@utils";

interface Props {
    stationInfo: StationInfoData | undefined;
    monuments: MonumentTypes | undefined;
    people: ((People & { role: string }) | undefined)[];
    station: StationData | undefined;
    stationMeta: StationMetadataServiceData | undefined;
    images: StationImagesData[] | undefined;
}

const Pdf = ({
    stationInfo,
    monuments,
    people,
    station,
    stationMeta,
    images,
}: Props) => {
    Font.register({
        family: "Open Sans",
        fonts: [
            {
                src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
            },
            {
                src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
                fontWeight: 600,
            },
            {
                src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-800.ttf",
                fontWeight: 900,
            },
        ],
    });

    const styles = StyleSheet.create({
        page: {
            flexDirection: "row",
            backgroundColor: "#E4E4E4",
            fontFamily: "Open Sans",
        },
        section: {
            margin: 10,
            padding: 10,
            display: "flex",
            width: "100%",
            flexDirection: "column",
        },
        viewHeader: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "gray",
            padding: 10,
            width: "100%",
        },
        textBold: {
            fontSize: 20,
            color: "#000000",
            fontWeight: "ultrabold",
        },
        textSemibold: {
            fontSize: 20,
            textAlign: "justify",
            color: "#000000",
            fontWeight: "semibold",
        },
        headersTitle: {
            fontSize: 16,
            color: "#000000",
            fontWeight: "semibold",
        },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={{ display: "flex", width: "100%" }}>
                    <View style={styles.section} fixed>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <Text style={styles.textBold}>
                                GNSS Station Report
                            </Text>
                            <Text>
                                Printed on{" "}
                                {formattedDates(new Date())?.split(",")[0]}{" "}
                            </Text>
                        </View>

                        <Svg height="3" style={{ marginTop: "10px" }}>
                            <Line
                                x1="0"
                                y1="0"
                                x2="555"
                                y2="0"
                                strokeWidth={2}
                                stroke="rgb(0,0,0)"
                            />
                        </Svg>
                        <Svg height="3">
                            <Line
                                x1="0"
                                y1="0"
                                x2="555"
                                y2="0"
                                strokeWidth={1}
                                stroke="rgb(0,0,0)"
                            />
                        </Svg>
                        <Svg height="3">
                            <Line
                                x1="0"
                                y1="0"
                                x2="555"
                                y2="0"
                                strokeWidth={2}
                                stroke="rgb(0,0,0)"
                            />
                        </Svg>
                    </View>

                    <View style={styles.viewHeader}>
                        <Text style={styles.headersTitle}>Station Name</Text>
                        <Text style={styles.headersTitle}>
                            Geodetic coordinates
                        </Text>
                        <Text style={styles.headersTitle}>
                            Geocentric Coordinates
                        </Text>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                        }}
                    >
                        <View style={{ width: "25%", fontSize: 12 }}>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <Text>Network code: </Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {station?.network_code.toUpperCase()}
                                </Text>
                            </View>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <Text>Station code: </Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {station?.station_code.toUpperCase()}
                                </Text>
                            </View>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <Text>Country code: </Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {station?.country_code.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                        <View style={{ width: "45%", fontSize: 12 }}>
                            <Text>
                                <Text>Latitude:</Text>
                                <Text>
                                    {" "}
                                    {decimalToDMS(
                                        Number(station?.lat.toFixed(8)),
                                        true,
                                    ) +
                                        " " +
                                        "(" +
                                        station?.lat.toFixed(8) +
                                        ")"}
                                </Text>
                            </Text>
                            <Text>
                                <Text>Longitude:</Text>
                                <Text>
                                    {" "}
                                    {decimalToDMS(
                                        Number(station?.lon.toFixed(8)),
                                        false,
                                    ) +
                                        " " +
                                        "(" +
                                        station?.lon.toFixed(8) +
                                        ")"}
                                </Text>
                            </Text>
                            <Text>
                                <Text>Height:</Text>
                                <Text> {Number(station?.height) + " m"}</Text>
                            </Text>
                        </View>
                        <View style={{ width: "30%", fontSize: 12 }}>
                            <Text>
                                <Text>X: </Text>
                                <Text>{station?.auto_x + " m"}</Text>
                            </Text>
                            <Text>
                                <Text>Y: </Text>
                                <Text>{station?.auto_y + " m"}</Text>
                            </Text>
                            <Text>
                                <Text>Z: </Text>
                                <Text>{station?.auto_z + " m"}</Text>
                            </Text>
                        </View>
                    </View>

                    <Svg height="20">
                        <Line
                            x1="10"
                            y1="0"
                            x2="590"
                            y2="0"
                            strokeWidth={4}
                            stroke="rgb(0,0,0)"
                        />
                    </Svg>
                    <View style={styles.section}>
                        <Text style={{ fontWeight: "bold", fontSize: "24px" }}>
                            COMMENTS
                        </Text>
                        <Text>
                            {stationMeta?.comments?.length > 0
                                ? stationMeta?.comments
                                : "........."}
                        </Text>
                        <Text style={{ fontWeight: "bold", fontSize: "24px" }}>
                            BATTERY DESCRIPTION
                        </Text>
                        <Text>
                            {stationMeta?.battery_description?.length > 0
                                ? stationMeta?.battery_description
                                : "........."}
                        </Text>
                        <Text style={{ fontWeight: "bold", fontSize: "24px" }}>
                            COMMUNICATIONS DESCRIPTION
                        </Text>
                        <Text>
                            {stationMeta?.communications_description?.length > 0
                                ? stationMeta?.communications_description
                                : "........."}
                        </Text>
                        <Text style={{ fontWeight: "bold", fontSize: "24px" }}>
                            REMOTE ACCESS LINK
                        </Text>
                        <Text>
                            {stationMeta?.remote_access_link?.length > 0
                                ? stationMeta?.remote_access_link
                                : "........."}
                        </Text>
                    </View>
                    <Svg height="20">
                        <Line
                            x1="10"
                            y1="0"
                            x2="590"
                            y2="0"
                            strokeWidth={4}
                            stroke="rgb(0,0,0)"
                        />
                    </Svg>
                    <View style={styles.section} break>
                        <Text style={{ fontWeight: "bold", fontSize: "24px" }}>
                            SITE PEOPLE
                        </Text>
                        {people?.map((person, idx) => (
                            <View
                                key={person?.id + String(idx)}
                                style={{ marginTop: 10 }}
                            >
                                <Text>
                                    <Text style={styles.textSemibold}>
                                        Name:
                                    </Text>
                                    <Text>
                                        {" "}
                                        {person?.first_name} {person?.last_name}
                                    </Text>
                                </Text>
                                <Text>
                                    <Text style={styles.textSemibold}>
                                        Role:
                                    </Text>
                                    <Text> {person?.role ?? ""}</Text>
                                </Text>
                                <Text>
                                    <Text style={styles.textSemibold}>
                                        Email:
                                    </Text>
                                    <Text> {person?.email}</Text>
                                </Text>
                                <Text>
                                    <Text style={styles.textSemibold}>
                                        Address:
                                    </Text>
                                    <Text> {person?.address}</Text>
                                </Text>
                                <Text>
                                    <Text style={styles.textSemibold}>
                                        Phone:
                                    </Text>
                                    <Text> {person?.phone}</Text>
                                </Text>
                            </View>
                        ))}
                    </View>
                    <Svg height="20">
                        <Line
                            x1="10"
                            y1="0"
                            x2="590"
                            y2="0"
                            strokeWidth={4}
                            stroke="rgb(0,0,0)"
                        />
                    </Svg>
                    <View style={styles.section} break>
                        <Text style={{ fontWeight: "bold", fontSize: "24px" }}>
                            MONUMENT TYPE
                        </Text>
                        <Text>
                            <Text style={styles.textSemibold}>
                                {monuments?.name}
                            </Text>
                        </Text>
                        <Text>
                            <Text style={styles.textSemibold}>
                                Monument photo:
                            </Text>
                        </Text>
                        <Image
                            style={{ width: "400px", height: "200px" }}
                            src={`data:image/*;base64,${monuments?.photo_file}`}
                        />
                    </View>
                    <Svg height="20">
                        <Line
                            x1="10"
                            y1="0"
                            x2="590"
                            y2="0"
                            strokeWidth={4}
                            stroke="rgb(0,0,0)"
                        />
                    </Svg>
                    <View style={styles.section}>
                        <Text style={{ fontWeight: "bold", fontSize: "24px" }}>
                            EQUIPMENT
                        </Text>
                        <View>
                            <Text>
                                <Text style={styles.textSemibold}>
                                    Receiver Type:
                                </Text>
                                <Text> {stationInfo?.receiver_code}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.textSemibold}>
                                    Receiver Serial Number:
                                </Text>
                                <Text> {stationInfo?.receiver_serial}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.textSemibold}>
                                    Receiver Firmware:
                                </Text>
                                <Text> {stationInfo?.receiver_firmware}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.textSemibold}>
                                    Receiver Version:
                                </Text>
                                <Text> {stationInfo?.receiver_vers}</Text>
                            </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text>
                                <Text style={styles.textSemibold}>
                                    Antenna Type:
                                </Text>
                                <Text> {stationInfo?.antenna_code}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.textSemibold}>
                                    Antenna Serial Number:
                                </Text>
                                <Text> {stationInfo?.antenna_serial}</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={styles.section} break>
                        <Text style={{ fontWeight: "bold", fontSize: "24px" }}>
                            PHOTOS
                        </Text>
                        {images?.map((img, idx) => (
                            <Image
                                key={img.id + String(idx)}
                                style={{
                                    width: 400,
                                    height: 300,
                                    marginBottom: 10,
                                }}
                                src={`data:image/*;base64,${img.actual_image}`}
                            />
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default Pdf;
