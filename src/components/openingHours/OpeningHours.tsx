import React, { useState } from "react";
import classes from "./OpeningHours.module.less";
import useOpeningHours, { ITime } from "../../api/useOpeningHours";
import {
	Spin,
	Typography,
	Button,
	Empty,
	Input,
	TimePicker,
	Dropdown,
	Menu,
} from "antd";
import {
	CalendarOutlined,
	PlusOutlined,
	SaveOutlined,
	DeleteOutlined,
} from "@ant-design/icons";
import * as Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);
moment().format();
moment.locale("de");

const { RangePicker } = TimePicker;

const { Title } = Typography;

interface Time {
	week: number;
	from: string;
	to: string;
}

const OpeningHours = () => {
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const { openingHours, loading, setOpeningHours, save } = useOpeningHours();

	if (loading || !openingHours) {
		return (
			<div className={classes.loadingContainer}>
				<Spin size="large"></Spin>
			</div>
		);
	}

	const handleClick = (id: string) => {
		setSelectedTime(id);
	};

	const add = (week: number) => {
		const newList: ITime[] = [
			...openingHours,
			{
				id: "will_be_overwritten",
				week,
				from: "12:00",
				to: "15:00",
			},
		];
		setOpeningHours(newList);
		save(newList);
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
						onClick={() => add(currentWeek)}
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
				{times
					.sort(
						(a, b) =>
							moment(a.from, "HH:mm").unix() - moment(b.from, "HH:mm").unix()
					)
					.map((o) => {
						const menu = (
							<Menu>
								<Menu.Item key="1" onClick={() => handleClick(o.id)}>
									Edit
								</Menu.Item>
								<Menu.Item key="2" onClick={() => deleteTime(o.id)}>
									Delete
								</Menu.Item>
							</Menu>
						);
						return (
							<Dropdown overlay={menu} trigger={["contextMenu"]}>
								<Button
									onClick={() => handleClick(o.id)}
									type={o.id === selectedTime ? "primary" : "dashed"}
									shape={"round"}
									icon={<CalendarOutlined />}
									style={{ width: "150px" }}>
									{o.from} - {o.to}
								</Button>
							</Dropdown>
						);
					})}
				<Button
					onClick={() => add(currentWeek)}
					type="dashed"
					shape="circle"
					style={{ width: "34px" }}
					icon={<PlusOutlined />}></Button>
			</div>
		);
	};

	const deleteTime = (id: string) => {
		const newList = openingHours.filter((t) => t.id !== id);
		setOpeningHours(newList);
		save(newList);
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

	const changeTime = (time: ITime) => {
		const newOpeningHours = openingHours.map((t) => {
			if (t.id === time.id) {
				return time;
			}
			return t;
		});
		setOpeningHours(newOpeningHours);
	};

	const renderEdit = () => {
		if (!selectedTime) {
			return;
		}
		const time = openingHours.find((t) => t.id === selectedTime);
		if (!time) {
			return;
		}
		console.log(selectedTime, time, time.from, time.to);
		return (
			<div className={classes.editContainer}>
				<Title level={4} style={{ color: "#6c757d", margin: "8px" }}>
					{getWeekString(time?.week || 1)}
				</Title>
				<div>
					<RangePicker
						style={{ margin: "8px" }}
						value={
							[moment(time.from, "HH:mm"), moment(time.to, "HH:mm")] as any
						}
						onChange={(e) => {
							const from = moment(e?.[0]).format("HH:mm");
							const to = moment(e?.[1]).format("HH:mm");
							changeTime({ ...time, from, to });
						}}
						minuteStep={15}
						picker="time"
						format={"HH:mm"}
					/>
					<Button type="primary" onClick={() => save()}>
						<SaveOutlined />
						Save
					</Button>
					<Button danger type="primary" onClick={() => deleteTime(time.id)}>
						<DeleteOutlined />
						Delete
					</Button>
				</div>
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
							openingHours.filter((t) => t.week === 1),
							moment().isoWeekday() === 1,
							1
						)}
					</div>
				</div>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Dienstag</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.filter((t) => t.week === 2),
							moment().isoWeekday() === 2,
							2
						)}
					</div>
				</div>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Mittwoch</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.filter((t) => t.week === 3),
							moment().isoWeekday() === 3,
							3
						)}
					</div>
				</div>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Donnerstag</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.filter((t) => t.week === 4),
							moment().isoWeekday() === 4,
							4
						)}
					</div>
				</div>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Freitag</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.filter((t) => t.week === 5),
							moment().isoWeekday() === 5,
							5
						)}
					</div>
				</div>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Samstag</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.filter((t) => t.week === 6),
							moment().isoWeekday() === 6,
							6
						)}
					</div>
				</div>
				<div>
					<span style={{ color: "#6c757d", marginTop: 0 }}>Sonntag</span>
					<div className={classes.times}>
						{renderButtons(
							openingHours.filter((t) => t.week === 7),
							moment().isoWeekday() === 7,
							7
						)}
					</div>
				</div>
			</div>
			<div>{selectedTime && renderEdit()}</div>
		</div>
	);
};

export default OpeningHours;
