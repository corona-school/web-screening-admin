import React, { useState } from "react";
import classes from "./OpeningHours.module.less";
import useOpeningHours, {
	ITime,
	IOpeningHours,
} from "../../api/useOpeningHours";
import { Spin, Typography, Button, Empty, Input } from "antd";
import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title } = Typography;

interface Time {
	week: number;
	from: string;
	to: string;
}

const OpeningHours = () => {
	const [selectedTime, setSelectedTime] = useState<Time | null>(null);
	const { openingHours, loading, setOpeningHours } = useOpeningHours();

	if (loading || !openingHours) {
		return (
			<div className={classes.loadingContainer}>
				<Spin size="large"></Spin>
			</div>
		);
	}

	const handleClick = (time: ITime, week: number) => {
		setSelectedTime({ week, from: time.from, to: time.to });
	};

	const renderButtons = (
		times: ITime[],
		isCurrentWeek: boolean,
		currentWeek: number
	) => {
		if (times.length === 0) {
			return (
				<div className={classes.emptyContainer}>
					<Empty
						style={{ marginLeft: "16px" }}
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description="Keine Screenings"></Empty>
					<Button
						type="primary"
						style={{ width: "140px", margin: "16px" }}
						icon={<PlusOutlined />}>
						Hinzufügen
					</Button>
				</div>
			);
		}
		return (
			<div>
				{times.map((o) => {
					return (
						<Button
							onClick={() => handleClick(o, currentWeek)}
							type={isCurrentWeek ? "primary" : "dashed"}
							shape="round"
							icon={<CalendarOutlined />}
							style={{ width: "160px" }}>
							{o.from} - {o.to}
						</Button>
					);
				})}
				<Button
					type="dashed"
					shape="circle"
					style={{ width: "34px" }}
					icon={<PlusOutlined />}></Button>
			</div>
		);
	};

	const getWeekString = (week: number) => {
		switch (week) {
			case 1:
				return "Montag";
			case 2:
				return "Dienstag";
			case 3:
				return "Mittwoch";
			case 4:
				return "Donnerstag";
			case 5:
				return "Freitag";
			case 6:
				return "Samstag";
			case 7:
				return "Sonntag";
		}
	};

	const renderEdit = () => {
		return (
			<div>
				{getWeekString(selectedTime?.week || 1)}
				<Input value={selectedTime?.from} style={{ width: "100px" }} />
				<Input value={selectedTime?.to} style={{ width: "100px" }} />
			</div>
		);
	};

	return (
		<div className={classes.root}>
			<div className={classes.container}>
				<Title level={4} style={{ color: "#6c757d", marginTop: 0 }}>
					Öffnungszeiten
				</Title>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Montag</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.Monday.times,
							moment().isoWeekday() === 1,
							1
						)}
					</div>
				</div>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Dienstag</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.Tuesday.times,
							moment().isoWeekday() === 2,
							2
						)}
					</div>
				</div>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Mittwoch</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.Wednesday.times,
							moment().isoWeekday() === 3,
							3
						)}
					</div>
				</div>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Donnerstag</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.Thursday.times,
							moment().isoWeekday() === 4,
							4
						)}
					</div>
				</div>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Freitag</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.Friday.times,
							moment().isoWeekday() === 5,
							5
						)}
					</div>
				</div>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Samstag</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.Saturday.times,
							moment().isoWeekday() === 6,
							6
						)}
					</div>
				</div>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Sonntag</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.Sunday.times,
							moment().isoWeekday() === 7,
							7
						)}
					</div>
				</div>
			</div>
			{/* <div>{selectedTime && renderEdit()}</div> */}
		</div>
	);
};

export default OpeningHours;
