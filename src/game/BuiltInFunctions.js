import {EngineException} from "../common/Exceptions.js";
import {decimalColorToHSVValues, decimalColorAndAlphaToRGBA, decimalColorToRGB, rgbValuesToDecimalColor, parseArrowString, asString, forceString, forceReal, forceInteger, toInteger, parseNewLineHash} from "../common/tools.js";

export default class BuiltInFunctions {
	// this = GML

	// # Computing things

	// ## Constants  // no functions

	// ## Real-valued functions

	static random([x]) {
		return Math.random() * x;
	}

	static random_range([x1, x2]) {
		return (Math.random() * (x2-x1)) + x1;
	}

	static irandom([x]) {
		return Math.floor(Math.random() * (Math.floor(x) + 1));
	}

	static irandom_range([x1, x2]) {
		return Math.floor(Math.random() * (Math.floor(x1) - Math.floor(x2) + 1)) + Math.floor(x2);
	}

	static random_set_seed([_]) {
		throw new EngineException("Function random_set_seed is not implemented");
		// return 0;
	}

	static random_get_seed([_]) {
		throw new EngineException("Function random_get_seed is not implemented");
		// return 0;
	}

	static randomize([_]) {
		throw new EngineException("Function randomize is not implemented");
		// return 0;
	}

	static choose([...vals]) {
		return vals[Math.floor((Math.random()*vals.length))];
	}

	static abs([x]) {
		return Math.abs(x);
	}

	static sign([x]) {
		return Math.sign(x);
	}

	static round([x]) {
		return toInteger(x);
	}

	static floor([x]) {
		return Math.floor(x);
	}

	static ceil([x]) {
		return Math.ceil(x);
	}

	static frac([x]) {
		return x % 1;
	}

	static sqrt([x]) {
		return Math.sqrt(x);
	}

	static sqr([x]) {
		return x * x;
	}

	static power([x, n]) {
		return x ** n;
	}

	static exp([x]) {
		return Math.exp(x);
	}

	static ln([x]) {
		return Math.log(x);
	}

	static log2([x]) {
		return Math.log2(x);
	}

	static log10([x]) {
		return Math.log10(x);
	}

	static logn([x, n]) {
		return Math.log(x) / Math.log(n);
	}

	static sin([x]) {
		return Math.sin(x);
	}

	static cos([x]) {
		return Math.cos(x);
	}

	static tan([x]) {
		return Math.tan(x);
	}

	static arcsin([x]) {
		return Math.asin(x);
	}

	static arccos([x]) {
		return Math.acos(x);
	}

	static arctan([x]) {
		return Math.atan(x);
	}

	static arctan2([y, x]) {
		return Math.atan2(y, x);
	}

	static degtorad([x]) {
		return x * Math.PI / 180;
	}

	static radtodeg([x]) {
		return x * (180 / Math.PI);
	}

	static min([...vals]) {
		return Math.min(...vals);
	}

	static max([...vals]) {
		return Math.max(...vals);
	}

	static mean([...vals]) {
		if (vals.length == 0) return 0;
		return vals.reduce((a, b) => a+b) / vals.length;
	}

	static median([...vals]) {
		if (vals.length == 0) return 0;
		vals.sort();
		if (vals.length % 2 != 0) {
			return vals[(vals.length-1) / 2];
		} else {
			return Math.min(vals[(vals.length / 2)], vals[(vals.length / 2)-1]);
		}
	}

	static point_distance([x1, y1, x2, y2]) {
		return Math.hypot(x2 - x1, y2 - y1);
	}

	static point_direction([x1, y1, x2, y2]) {
		return Math.atan2(-(y2 - y1), x2 - x1) * (180 / Math.PI);
	}

	static lengthdir_x([len, dir]) {
		return Math.cos(dir * Math.PI / 180) * len;
	}

	static lengthdir_y([len, dir]) {
		return Math.sin(dir * Math.PI / 180) * len;
	}

	static is_real([x]) {
		return (typeof x == "number") ? 1 : 0;
	}

	static is_string([x]) {
		return (typeof x == "string") ? 1 : 0;
	}

	// ## String handling functions

	static chr([val]) {
		return String.fromCharCode(val);
	}

	static ord([str]) {
		return str.charCodeAt(0);
	}

	static real([str]) {
		const float = parseFloat(str);
		return (!Number.isNaN(float)) ? float : 0;
	}

	static string([val]) {
		return val.toString();
	}

	static string_format([_]) {
		throw new EngineException("Function string_format is not implemented");
		// return 0;
	}

	static string_length([str]) {
		return str.length;
	}

	static string_pos([substr, str]) {
		return str.indexOf(substr) + 1;
	}

	static string_copy([str, index, count]) {
		return str.slice(index - 1, index - 1 + count);
	}

	static string_char_at([str, index]) {
		return str[index - 1];
	}

	static string_delete([_]) {
		throw new EngineException("Function string_delete is not implemented");
		// return 0;
	}

	static string_insert([_]) {
		throw new EngineException("Function string_insert is not implemented");
		// return 0;
	}

	static string_replace([str, substr, newstr]) {
		return str.replace(substr, newstr);
	}

	static string_replace_all([str, substr, newstr]) {
		return str.replaceAll(substr, newstr);
	}

	static string_count([_]) {
		throw new EngineException("Function string_count is not implemented");
		// return 0;
	}

	static string_lower([str]) {
		return str.toLowerCase();
	}

	static string_upper([str]) {
		return str.toUpperCase();
	}

	static string_repeat([str, count]) {
		return str.repeat(count);
	}

	static string_letters([_]) {
		throw new EngineException("Function string_letters is not implemented");
		// return 0;
	}

	static string_digits([_]) {
		throw new EngineException("Function string_digits is not implemented");
		// return 0;
	}

	static string_lettersdigits([_]) {
		throw new EngineException("Function string_lettersdigits is not implemented");
		// return 0;
	}

	static clipboard_has_text([_]) {
		throw new EngineException("Function clipboard_has_text is not implemented");
		// return 0;
	}

	static clipboard_get_text([_]) {
		throw new EngineException("Function clipboard_get_text is not implemented");
		// return 0;
	}

	static clipboard_set_text([_]) {
		throw new EngineException("Function clipboard_set_text is not implemented");
		// return 0;
	}

	// ## Dealing with dates and time

	static date_current_datetime([_]) {
		throw new EngineException("Function date_current_datetime is not implemented");
		// return 0;
	}

	static date_current_date([_]) {
		throw new EngineException("Function date_current_date is not implemented");
		// return 0;
	}

	static date_current_time([_]) {
		throw new EngineException("Function date_current_time is not implemented");
		// return 0;
	}

	static date_create_datetime([_]) {
		throw new EngineException("Function date_create_datetime is not implemented");
		// return 0;
	}

	static date_create_date([_]) {
		throw new EngineException("Function date_create_date is not implemented");
		// return 0;
	}

	static date_create_time([_]) {
		throw new EngineException("Function date_create_time is not implemented");
		// return 0;
	}

	static date_valid_datetime([_]) {
		throw new EngineException("Function date_valid_datetime is not implemented");
		// return 0;
	}

	static date_valid_date([_]) {
		throw new EngineException("Function date_valid_date is not implemented");
		// return 0;
	}

	static date_valid_time([_]) {
		throw new EngineException("Function date_valid_time is not implemented");
		// return 0;
	}

	static date_inc_year([_]) {
		throw new EngineException("Function date_inc_year is not implemented");
		// return 0;
	}

	static date_inc_month([_]) {
		throw new EngineException("Function date_inc_month is not implemented");
		// return 0;
	}

	static date_inc_week([_]) {
		throw new EngineException("Function date_inc_week is not implemented");
		// return 0;
	}

	static date_inc_day([_]) {
		throw new EngineException("Function date_inc_day is not implemented");
		// return 0;
	}

	static date_inc_hour([_]) {
		throw new EngineException("Function date_inc_hour is not implemented");
		// return 0;
	}

	static date_inc_minute([_]) {
		throw new EngineException("Function date_inc_minute is not implemented");
		// return 0;
	}

	static date_inc_second([_]) {
		throw new EngineException("Function date_inc_second is not implemented");
		// return 0;
	}

	static date_get_year([_]) {
		throw new EngineException("Function date_get_year is not implemented");
		// return 0;
	}

	static date_get_month([_]) {
		throw new EngineException("Function date_get_month is not implemented");
		// return 0;
	}

	static date_get_week([_]) {
		throw new EngineException("Function date_get_week is not implemented");
		// return 0;
	}

	static date_get_day([_]) {
		throw new EngineException("Function date_get_day is not implemented");
		// return 0;
	}

	static date_get_hour([_]) {
		throw new EngineException("Function date_get_hour is not implemented");
		// return 0;
	}

	static date_get_minute([_]) {
		throw new EngineException("Function date_get_minute is not implemented");
		// return 0;
	}

	static date_get_second([_]) {
		throw new EngineException("Function date_get_second is not implemented");
		// return 0;
	}

	static date_get_weekday([_]) {
		throw new EngineException("Function date_get_weekday is not implemented");
		// return 0;
	}

	static date_get_day_of_year([_]) {
		throw new EngineException("Function date_get_day_of_year is not implemented");
		// return 0;
	}

	static date_get_hour_of_year([_]) {
		throw new EngineException("Function date_get_hour_of_year is not implemented");
		// return 0;
	}

	static date_get_minute_of_year([_]) {
		throw new EngineException("Function date_get_minute_of_year is not implemented");
		// return 0;
	}

	static date_get_second_of_year([_]) {
		throw new EngineException("Function date_get_second_of_year is not implemented");
		// return 0;
	}

	static date_year_span([_]) {
		throw new EngineException("Function date_year_span is not implemented");
		// return 0;
	}

	static date_month_span([_]) {
		throw new EngineException("Function date_month_span is not implemented");
		// return 0;
	}

	static date_week_span([_]) {
		throw new EngineException("Function date_week_span is not implemented");
		// return 0;
	}

	static date_day_span([_]) {
		throw new EngineException("Function date_day_span is not implemented");
		// return 0;
	}

	static date_hour_span([_]) {
		throw new EngineException("Function date_hour_span is not implemented");
		// return 0;
	}

	static date_minute_span([_]) {
		throw new EngineException("Function date_minute_span is not implemented");
		// return 0;
	}

	static date_second_span([_]) {
		throw new EngineException("Function date_second_span is not implemented");
		// return 0;
	}

	static date_compare_datetime([_]) {
		throw new EngineException("Function date_compare_datetime is not implemented");
		// return 0;
	}

	static date_compare_date([_]) {
		throw new EngineException("Function date_compare_date is not implemented");
		// return 0;
	}

	static date_compare_time([_]) {
		throw new EngineException("Function date_compare_time is not implemented");
		// return 0;
	}

	static date_date_of([_]) {
		throw new EngineException("Function date_date_of is not implemented");
		// return 0;
	}

	static date_time_of([_]) {
		throw new EngineException("Function date_time_of is not implemented");
		// return 0;
	}

	static date_datetime_string([_]) {
		throw new EngineException("Function date_datetime_string is not implemented");
		// return 0;
	}

	static date_date_string([_]) {
		throw new EngineException("Function date_date_string is not implemented");
		// return 0;
	}

	static date_time_string([_]) {
		throw new EngineException("Function date_time_string is not implemented");
		// return 0;
	}

	static date_days_in_month([_]) {
		throw new EngineException("Function date_days_in_month is not implemented");
		// return 0;
	}

	static date_days_in_year([_]) {
		throw new EngineException("Function date_days_in_year is not implemented");
		// return 0;
	}

	static date_leap_year([_]) {
		throw new EngineException("Function date_leap_year is not implemented");
		// return 0;
	}

	static date_is_today([_]) {
		throw new EngineException("Function date_is_today is not implemented");
		// return 0;
	}

	// # Game play

	// ## Moving around

	static motion_set([dir, speed]) {
		this.currentInstance.setDirectionAndSpeed(dir, speed);
		return 0;
	}

	static motion_add([dir, speed]) {
		const dir_radians = dir * (Math.PI / 180);
		this.currentInstance.setHspeedAndVspeed(
			this.currentInstance.vars.getBuiltIn("hspeed") + Math.cos(dir_radians) * speed,
			this.currentInstance.vars.getBuiltIn("vspeed") + -Math.sin(dir_radians) * speed,
		);
		return 0;
	}

	static place_free([x, y]) {
		return !this.game.collisionInstanceOnInstances(this.currentInstance, this.game.instances, x, y, true) ? 1 : 0;
	}

	static place_empty([x, y]) {
		return !this.game.collisionInstanceOnInstances(this.currentInstance, this.game.instances, x, y, false) ? 1 : 0;
	}

	static place_meeting([x, y, obj]) {
		const instances = this.objectReferenceToInstances(obj);
		if (!Array.isArray(instances)) { return 0; }
		return this.game.collisionInstanceOnInstances(this.currentInstance, instances, x, y, false) ? 1 : 0;
	}

	static place_snapped([hsnap, vsnap]) {
		return (this.currentInstance.vars.getBuiltIn("x") % hsnap == 0) && (this.currentInstance.vars.getBuiltIn("y") % vsnap == 0);
	}

	static move_random([hsnap, vsnap]) {
		hsnap = hsnap <= 0 ? 1 : hsnap;
		vsnap = vsnap <= 0 ? 1 : vsnap;

		// TODO: figure out what GM really does.

		let x, y;
		for (let i=0; i<100; ++i) {
			x = Math.floor((Math.random() * this.game.room.width) / hsnap) * hsnap;
			y = Math.floor((Math.random() * this.game.room.height) / vsnap) * vsnap;

			if (!this.game.collisionInstanceOnInstances(this.currentInstance, this.game.instances, x, y, true)) {
				this.currentInstance.vars.setBuiltIn("x", x);
				this.currentInstance.vars.setBuiltIn("y", y);
				break;
			}
		}

		return 0;
	}

	static move_snap([hsnap, vsnap]) {
		this.currentInstance.vars.setBuiltIn("x", Math.floor(this.currentInstance.vars.getBuiltIn("x") / hsnap) * hsnap);
		this.currentInstance.vars.setBuiltIn("y", Math.floor(this.currentInstance.vars.getBuiltIn("y") / vsnap) * vsnap);
		return 0;
	}

	static move_wrap([hor, vert, margin]) {
		if (hor) {
			const x = this.currentInstance.vars.getBuiltIn("x");
			if (x >= this.game.room.width + margin) {
				this.currentInstance.vars.setBuiltIn("x", x - this.game.room.width - margin*2);
			} else
			if (x < 0 - margin) {
				this.currentInstance.vars.setBuiltIn("x", this.game.room.width + x + margin*2);
			}
		}

		if (vert) {
			const y = this.currentInstance.vars.getBuiltIn("y");
			if (y >= this.game.room.height + margin) {
				this.currentInstance.vars.setBuiltIn("y", y - this.game.room.height - margin*2);
			} else
			if (y < 0 - margin) {
				this.currentInstance.vars.setBuiltIn("y", this.game.room.height + y - margin*2);
			}
		}
		return 0;
	}

	static move_towards_point([x, y, sp]) {
		const cx = this.currentInstance.vars.getBuiltIn("x");
		const cy = this.currentInstance.vars.getBuiltIn("y");
		this.currentInstance.setDirectionAndSpeed(Math.atan2(-(y - cy), x - cx) * (180 / Math.PI), sp);
		return 0;
	}

	static move_bounce_solid([_]) {
		throw new EngineException("Function move_bounce_solid is not implemented");
		// return 0;
	}

	static move_bounce_all([_]) {
		throw new EngineException("Function move_bounce_all is not implemented");
		// return 0;
	}

	static move_contact_solid([_]) {
		throw new EngineException("Function move_contact_solid is not implemented");
		// return 0;
	}

	static move_contact_all([_]) {
		throw new EngineException("Function move_contact_all is not implemented");
		// return 0;
	}

	static move_outside_solid([_]) {
		throw new EngineException("Function move_outside_solid is not implemented");
		// return 0;
	}

	static move_outside_all([_]) {
		throw new EngineException("Function move_outside_all is not implemented");
		// return 0;
	}

	static distance_to_point([_]) {
		throw new EngineException("Function distance_to_point is not implemented");
		// return 0;
	}

	static distance_to_object([_]) {
		throw new EngineException("Function distance_to_object is not implemented");
		// return 0;
	}

	static position_empty([_]) {
		throw new EngineException("Function position_empty is not implemented");
		// return 0;
	}

	static position_meeting([_]) {
		throw new EngineException("Function position_meeting is not implemented");
		// return 0;
	}

	// ## Paths

	static path_start([_]) {
		throw new EngineException("Function path_start is not implemented");
		// return 0;
	}

	static path_end([_]) {
		throw new EngineException("Function path_end is not implemented");
		// return 0;
	}

	// ## Motion planning

	static mp_linear_step([_]) {
		throw new EngineException("Function mp_linear_step is not implemented");
		// return 0;
	}

	static mp_linear_step_object([_]) {
		throw new EngineException("Function mp_linear_step_object is not implemented");
		// return 0;
	}

	static mp_potential_step([_]) {
		throw new EngineException("Function mp_potential_step is not implemented");
		// return 0;
	}

	static mp_potential_step_object([_]) {
		throw new EngineException("Function mp_potential_step_object is not implemented");
		// return 0;
	}

	static mp_potential_settings([_]) {
		throw new EngineException("Function mp_potential_settings is not implemented");
		// return 0;
	}

	static mp_linear_path([_]) {
		throw new EngineException("Function mp_linear_path is not implemented");
		// return 0;
	}

	static mp_linear_path_object([_]) {
		throw new EngineException("Function mp_linear_path_object is not implemented");
		// return 0;
	}

	static mp_potential_path([_]) {
		throw new EngineException("Function mp_potential_path is not implemented");
		// return 0;
	}

	static mp_potential_path_object([_]) {
		throw new EngineException("Function mp_potential_path_object is not implemented");
		// return 0;
	}

	static mp_grid_create([_]) {
		throw new EngineException("Function mp_grid_create is not implemented");
		// return 0;
	}

	static mp_grid_destroy([_]) {
		throw new EngineException("Function mp_grid_destroy is not implemented");
		// return 0;
	}

	static mp_grid_clear_all([_]) {
		throw new EngineException("Function mp_grid_clear_all is not implemented");
		// return 0;
	}

	static mp_grid_clear_cell([_]) {
		throw new EngineException("Function mp_grid_clear_cell is not implemented");
		// return 0;
	}

	static mp_grid_clear_rectangle([_]) {
		throw new EngineException("Function mp_grid_clear_rectangle is not implemented");
		// return 0;
	}

	static mp_grid_add_cell([_]) {
		throw new EngineException("Function mp_grid_add_cell is not implemented");
		// return 0;
	}

	static mp_grid_add_rectangle([_]) {
		throw new EngineException("Function mp_grid_add_rectangle is not implemented");
		// return 0;
	}

	static mp_grid_add_instances([_]) {
		throw new EngineException("Function mp_grid_add_instances is not implemented");
		// return 0;
	}

	static mp_grid_path([_]) {
		throw new EngineException("Function mp_grid_path is not implemented");
		// return 0;
	}

	static mp_grid_draw([_]) {
		throw new EngineException("Function mp_grid_draw is not implemented");
		// return 0;
	}

	// ## Collision checking

	static collision_point([_]) {
		throw new EngineException("Function collision_point is not implemented");
		// return 0;
	}

	static collision_rectangle([_]) {
		throw new EngineException("Function collision_rectangle is not implemented");
		// return 0;
	}

	static collision_circle([_]) {
		throw new EngineException("Function collision_circle is not implemented");
		// return 0;
	}

	static collision_ellipse([_]) {
		throw new EngineException("Function collision_ellipse is not implemented");
		// return 0;
	}

	static collision_line([_]) {
		throw new EngineException("Function collision_line is not implemented");
		// return 0;
	}

	// ## Instances

	static instance_find([_]) {
		throw new EngineException("Function instance_find is not implemented");
		// return 0;
	}

	static instance_exists([obj]) {
		if (obj == -7) { // local
			return 0;
		}

		const instances = this.objectReferenceToInstances(obj);

		if (Array.isArray(instances)) {
			if (instances.length > 0) {
				return 1;
			}
		}

		return 0;
	}

	static instance_number([obj]) {
		if (obj == -7) { // local
			return 0;
		}

		const instances = this.objectReferenceToInstances(obj);
		if (Array.isArray(instances)) {
			return instances.length;
		}

		return 0;
	}

	static instance_position([_]) {
		throw new EngineException("Function instance_position is not implemented");
		// return 0;
	}

	static instance_nearest([_]) {
		throw new EngineException("Function instance_nearest is not implemented");
		// return 0;
	}

	static instance_furthest([_]) {
		throw new EngineException("Function instance_furthest is not implemented");
		// return 0;
	}

	static instance_place([_]) {
		throw new EngineException("Function instance_place is not implemented");
		// return 0;
	}

	static async instance_create([x, y, obj]) {
		const object = this.game.getResourceById("ProjectObject", obj);
		if (object == null) {
			throw this.game.makeNonFatalError({
					type: "creating_instance_for_non_existing_object",
					objectIndex: obj,
				}, "Creating instance for non-existing object: " + obj.toString());
		}

		return await this.game.instanceCreate(null, x, y, obj);
	}

	static instance_copy([_]) {
		throw new EngineException("Function instance_copy is not implemented");
		// return 0;
	}

	static async instance_destroy([]) {
		await this.game.doEvent(this.game.getEventOfInstance(this.currentInstance, "destroy"), this.currentInstance);
		this.currentInstance.exists = false;
		return 0;
	}

	static instance_change([_]) {
		throw new EngineException("Function instance_change is not implemented");
		// return 0;
	}

	static position_destroy([_]) {
		throw new EngineException("Function position_destroy is not implemented");
		// return 0;
	}

	static position_change([_]) {
		throw new EngineException("Function position_change is not implemented");
		// return 0;
	}

	// ## Deactivating instances

	static instance_deactivate_all([_]) {
		throw new EngineException("Function instance_deactivate_all is not implemented");
		// return 0;
	}

	static instance_deactivate_object([_]) {
		throw new EngineException("Function instance_deactivate_object is not implemented");
		// return 0;
	}

	static instance_deactivate_region([_]) {
		throw new EngineException("Function instance_deactivate_region is not implemented");
		// return 0;
	}

	static instance_activate_all([_]) {
		throw new EngineException("Function instance_activate_all is not implemented");
		// return 0;
	}

	static instance_activate_object([_]) {
		throw new EngineException("Function instance_activate_object is not implemented");
		// return 0;
	}

	static instance_activate_region([_]) {
		throw new EngineException("Function instance_activate_region is not implemented");
		// return 0;
	}

	// ## Timing

	static async sleep([numb]) {
		await new Promise((resolve) => {
			setTimeout(() => resolve(), numb);
		});
		return 0;
	}

	// ## Rooms

	static room_goto([numb]) {
		const room = this.game.getResourceById("ProjectRoom", numb);
		if (room == null) {
			throw this.game.makeFatalError({
					type: "unexisting_room_number",
					numb: numb,
				}, "Unexisting room number: " + numb.toString());
		}
		this.game.stepStopAction = async () => {
			await this.game.loadRoom(room);
			this.game.startMainLoop();
		};
		return 0;
	}

	static room_goto_previous([]) {
		return BuiltInFunctions.room_goto.call(this, [BuiltInFunctions.room_previous.call(this, [this.game.room.resource.id])]);
	}

	static room_goto_next([]) {
		return BuiltInFunctions.room_goto.call(this, [BuiltInFunctions.room_next.call(this, [this.game.room.resource.id])]);
	}

	static room_previous([numb]) {
		const index = this.game.project.resources.ProjectRoom.findIndex(x => x.id == numb);
		if (index == null || index == 0) {
			return -1;
		}
		return this.game.project.resources.ProjectRoom[index-1].id;
	}

	static room_next([numb]) {
		const index = this.game.project.resources.ProjectRoom.findIndex(x => x.id == numb);
		if (index == null || index == this.game.project.resources.ProjectRoom.length - 1) {
			return -1;
		}
		return this.game.project.resources.ProjectRoom[index+1].id;
	}

	static room_restart([]) {
		return BuiltInFunctions.room_goto.call(this, [this.game.room.resource.id]);
	}

	static game_end([]) {
		this.game.stepStopAction = async () => {
			await this.game.end();
		};
		return 0;
	}

	static game_restart([_]) {
		throw new EngineException("Function game_restart is not implemented");
		// return 0;
	}

	static game_save([_]) {
		throw new EngineException("Function game_save is not implemented");
		// return 0;
	}

	static game_load([_]) {
		throw new EngineException("Function game_load is not implemented");
		// return 0;
	}

	static transition_define([_]) {
		throw new EngineException("Function transition_define is not implemented");
		// return 0;
	}

	static transition_exists([_]) {
		throw new EngineException("Function transition_exists is not implemented");
		// return 0;
	}

	// ## Score  // no functions

	// ## Generating events

	static event_perform([_]) {
		throw new EngineException("Function event_perform is not implemented");
		// return 0;
	}

	static event_perform_object([_]) {
		throw new EngineException("Function event_perform_object is not implemented");
		// return 0;
	}

	static event_user([_]) {
		throw new EngineException("Function event_user is not implemented");
		// return 0;
	}

	static event_inherited([_]) {
		throw new EngineException("Function event_inherited is not implemented");
		// return 0;
	}

	// ## Miscellaneous variables and functions

	static show_debug_message([message]) {
		console.log(message);
		return 0;
	}

	static variable_global_exists([_]) {
		throw new EngineException("Function variable_global_exists is not implemented");
		// return 0;
	}

	static variable_local_exists([_]) {
		throw new EngineException("Function variable_local_exists is not implemented");
		// return 0;
	}

	static variable_global_get([_]) {
		throw new EngineException("Function variable_global_get is not implemented");
		// return 0;
	}

	static variable_global_array_get([_]) {
		throw new EngineException("Function variable_global_array_get is not implemented");
		// return 0;
	}

	static variable_global_array2_get([_]) {
		throw new EngineException("Function variable_global_array2_get is not implemented");
		// return 0;
	}

	static variable_local_get([_]) {
		throw new EngineException("Function variable_local_get is not implemented");
		// return 0;
	}

	static variable_local_array_get([_]) {
		throw new EngineException("Function variable_local_array_get is not implemented");
		// return 0;
	}

	static variable_local_array2_get([_]) {
		throw new EngineException("Function variable_local_array2_get is not implemented");
		// return 0;
	}

	static variable_global_set([_]) {
		throw new EngineException("Function variable_global_set is not implemented");
		// return 0;
	}

	static variable_global_array_set([_]) {
		throw new EngineException("Function variable_global_array_set is not implemented");
		// return 0;
	}

	static variable_global_array2_set([_]) {
		throw new EngineException("Function variable_global_array2_set is not implemented");
		// return 0;
	}

	static variable_local_set([_]) {
		throw new EngineException("Function variable_local_set is not implemented");
		// return 0;
	}

	static variable_local_array_set([_]) {
		throw new EngineException("Function variable_local_array_set is not implemented");
		// return 0;
	}

	static variable_local_array2_set([_]) {
		throw new EngineException("Function variable_local_array2_set is not implemented");
		// return 0;
	}

	static set_program_priority([_]) {
		throw new EngineException("Function set_program_priority is not implemented");
		// return 0;
	}

	static set_application_title([_]) {
		throw new EngineException("Function set_application_title is not implemented");
		// return 0;
	}

	// # User interaction

	// ## The keyboard

	static keyboard_set_map([_]) {
		throw new EngineException("Function keyboard_set_map is not implemented");
		// return 0;
	}

	static keyboard_get_map([_]) {
		throw new EngineException("Function keyboard_get_map is not implemented");
		// return 0;
	}

	static keyboard_unset_map([_]) {
		throw new EngineException("Function keyboard_unset_map is not implemented");
		// return 0;
	}

	static keyboard_check([key]) {
		return this.game.getKey(key, this.game.key) ? 1 : 0;
	}

	static keyboard_check_pressed([key]) {
		return this.game.getKey(key, this.game.keyPressed) ? 1 : 0;
	}

	static keyboard_check_released([key]) {
		return this.game.getKey(key, this.game.keyReleased) ? 1 : 0;
	}

	static keyboard_check_direct([_]) {
		throw new EngineException("Function keyboard_check_direct is not implemented");
		// return 0;
	}

	static keyboard_get_numlock([_]) {
		throw new EngineException("Function keyboard_get_numlock is not implemented");
		// return 0;
	}

	static keyboard_set_numlock([_]) {
		throw new EngineException("Function keyboard_set_numlock is not implemented");
		// return 0;
	}

	static keyboard_key_press([_]) {
		throw new EngineException("Function keyboard_key_press is not implemented");
		// return 0;
	}

	static keyboard_key_release([_]) {
		throw new EngineException("Function keyboard_key_release is not implemented");
		// return 0;
	}

	static keyboard_clear([_]) {
		throw new EngineException("Function keyboard_clear is not implemented");
		// return 0;
	}

	static io_clear([_]) {
		throw new EngineException("Function io_clear is not implemented");
		// return 0;
	}

	static io_handle([_]) {
		throw new EngineException("Function io_handle is not implemented");
		// return 0;
	}

	static keyboard_wait([_]) {
		throw new EngineException("Function keyboard_wait is not implemented");
		// return 0;
	}

	// ## The mouse

	static mouse_check_button([numb]) {
		return this.game.getMouse(numb, this.game.mouse) ? 1 : 0;
	}

	static mouse_check_button_pressed([numb]) {
		return this.game.getMouse(numb, this.game.mousePressed) ? 1 : 0;
	}

	static mouse_check_button_released([numb]) {
		return this.game.getMouse(numb, this.game.mouseReleased) ? 1 : 0;
	}

	static mouse_wheel_up([]) {
		return (this.game.mouseWheel < 0);
	}

	static mouse_wheel_down([]) {
		return (this.game.mouseWheel > 0);
	}

	static mouse_clear([_]) {
		throw new EngineException("Function mouse_clear is not implemented");
		// return 0;
	}

	// static io_clear ([_]) {} // repeated
	// static io_handle ([_]) {} // repeated

	static mouse_wait([_]) {
		throw new EngineException("Function mouse_wait is not implemented");
		// return 0;
	}

	// ## The joystick

	static joystick_exists([_]) {
		throw new EngineException("Function joystick_exists is not implemented");
		// return 0;
	}

	static joystick_name([_]) {
		throw new EngineException("Function joystick_name is not implemented");
		// return 0;
	}

	static joystick_axes([_]) {
		throw new EngineException("Function joystick_axes is not implemented");
		// return 0;
	}

	static joystick_buttons([_]) {
		throw new EngineException("Function joystick_buttons is not implemented");
		// return 0;
	}

	static joystick_has_pov([_]) {
		throw new EngineException("Function joystick_has_pov is not implemented");
		// return 0;
	}

	static joystick_direction([_]) {
		throw new EngineException("Function joystick_direction is not implemented");
		// return 0;
	}

	static joystick_check_button([_]) {
		throw new EngineException("Function joystick_check_button is not implemented");
		// return 0;
	}

	static joystick_xpos([_]) {
		throw new EngineException("Function joystick_xpos is not implemented");
		// return 0;
	}

	static joystick_ypos([_]) {
		throw new EngineException("Function joystick_ypos is not implemented");
		// return 0;
	}

	static joystick_zpos([_]) {
		throw new EngineException("Function joystick_zpos is not implemented");
		// return 0;
	}

	static joystick_rpos([_]) {
		throw new EngineException("Function joystick_rpos is not implemented");
		// return 0;
	}

	static joystick_upos([_]) {
		throw new EngineException("Function joystick_upos is not implemented");
		// return 0;
	}

	static joystick_vpos([_]) {
		throw new EngineException("Function joystick_vpos is not implemented");
		// return 0;
	}

	static joystick_pov([_]) {
		throw new EngineException("Function joystick_pov is not implemented");
		// return 0;
	}

	// # Game graphics

	// ## Sprites and images  // no functions

	// ## Backgrounds  // no functions

	// ## Drawing sprites and backgrounds

	static draw_sprite([spriteIndex, subimg, x, y]) {
		if (spriteIndex >= 0) {
			const sprite = this.game.project.resources.ProjectSprite.find(x => x.id == spriteIndex);
			if (sprite) {
				this.game.drawSprite(sprite, subimg % sprite.images.length, x, y);
			} else {
				throw this.game.makeNonFatalError({
					type: "trying_to_draw_non_existing_sprite",
					spriteIndex: spriteIndex,
				}, "Trying to draw non-existing sprite. (" + spriteIndex.toString() +")");
			}
		} else {
			throw this.game.makeNonFatalError({
				type: "trying_to_draw_non_existing_sprite",
				spriteIndex: spriteIndex,
			}, "Trying to draw non-existing sprite. (" + spriteIndex.toString() +")");
		}

		return 0;
	}

	static draw_sprite_stretched([_]) {
		throw new EngineException("Function draw_sprite_stretched is not implemented");
		// return 0;
	}

	static draw_sprite_tiled([_]) {
		throw new EngineException("Function draw_sprite_tiled is not implemented");
		// return 0;
	}

	static draw_sprite_part([_]) {
		throw new EngineException("Function draw_sprite_part is not implemented");
		// return 0;
	}

	static draw_background([_]) {
		throw new EngineException("Function draw_background is not implemented");
		// return 0;
	}

	static draw_background_stretched([_]) {
		throw new EngineException("Function draw_background_stretched is not implemented");
		// return 0;
	}

	static draw_background_tiled([_]) {
		throw new EngineException("Function draw_background_tiled is not implemented");
		// return 0;
	}

	static draw_background_part([_]) {
		throw new EngineException("Function draw_background_part is not implemented");
		// return 0;
	}

	static draw_sprite_ext([_]) {
		throw new EngineException("Function draw_sprite_ext is not implemented");
		// return 0;
	}

	static draw_sprite_stretched_ext([_]) {
		throw new EngineException("Function draw_sprite_stretched_ext is not implemented");
		// return 0;
	}

	static draw_sprite_tiled_ext([_]) {
		throw new EngineException("Function draw_sprite_tiled_ext is not implemented");
		// return 0;
	}

	static draw_sprite_part_ext([_]) {
		throw new EngineException("Function draw_sprite_part_ext is not implemented");
		// return 0;
	}

	static draw_sprite_general([_]) {
		throw new EngineException("Function draw_sprite_general is not implemented");
		// return 0;
	}

	static draw_background_ext([_]) {
		throw new EngineException("Function draw_background_ext is not implemented");
		// return 0;
	}

	static draw_background_stretched_ext([_]) {
		throw new EngineException("Function draw_background_stretched_ext is not implemented");
		// return 0;
	}

	static draw_background_tiled_ext([_]) {
		throw new EngineException("Function draw_background_tiled_ext is not implemented");
		// return 0;
	}

	static draw_background_part_ext([_]) {
		throw new EngineException("Function draw_background_part_ext is not implemented");
		// return 0;
	}

	static draw_background_general([_]) {
		throw new EngineException("Function draw_background_general is not implemented");
		// return 0;
	}

	// ## Drawing shapes

	static draw_clear([col]) {
		this.game.ctx.fillStyle = decimalColorToRGB(col);
		this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
		return 0;
	}

	static draw_clear_alpha([_]) {
		throw new EngineException("Function draw_clear_alpha is not implemented");
		// return 0;
	}

	static draw_point([x, y]) {
		this.game.ctx.fillStyle = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);
		this.game.ctx.fillRect(x, y, 1, 1);
		return 0;
	}

	static draw_line([x1, y1, x2, y2]) {
		this.game.ctx.strokeStyle = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);

		this.game.ctx.save();
		this.game.ctx.translate(0.5, 0.5);

		this.game.ctx.beginPath();
		this.game.ctx.moveTo(x1, y1);
		this.game.ctx.lineTo(x2, y2);
		this.game.ctx.closePath();
		this.game.ctx.stroke();

		this.game.ctx.restore();

		return 0;
	}

	static draw_line_width([_]) {
		throw new EngineException("Function draw_line_width is not implemented");
		// return 0;
	}

	static draw_rectangle([x1, y1, x2, y2, outline]) {
		this.game.ctx.fillStyle = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);
		this.game.ctx.strokeStyle = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);

		if (outline >= 1) {
			this.game.ctx.save();
			this.game.ctx.translate(0.5, 0.5);
			this.game.ctx.strokeRect(x1, y1, x2-x1, y2-y1);
			this.game.ctx.restore();
		} else {
			this.game.ctx.fillRect(x1, y1, x2-x1, y2-y1);
		}

		return 0;
	}

	static draw_roundrect([_]) {
		throw new EngineException("Function draw_roundrect is not implemented");
		// return 0;
	}

	static draw_triangle([_]) {
		throw new EngineException("Function draw_triangle is not implemented");
		// return 0;
	}

	static draw_circle([x, y, r, outline]) {
		const style = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);
		this.game.ctx.fillStyle = style;
		this.game.ctx.strokeStyle = style;

		this.game.ctx.beginPath();
		this.game.ctx.arc(x, y, r, 0, Math.PI*2);
		if (outline >= 1) {
			this.game.ctx.stroke();
		} else {
			this.game.ctx.fill();
		}
		this.game.ctx.closePath();

		return 0;
	}

	static draw_ellipse([x1, y1, x2, y2, outline]) {
		const style = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);
		const x = (x2 - x1) / 2 + x1;
		const y = (y2 - y1) / 2 + y1;

		this.game.ctx.fillStyle = style;
		this.game.ctx.strokeStyle = style;

		this.game.ctx.beginPath();
		this.game.ctx.ellipse(x, y, x2 - x, y2 - y, 0, 0, Math.PI*2);
		if (outline >= 1) {
			this.game.ctx.stroke();
		} else {
			this.game.ctx.fill();
		}
		this.game.ctx.closePath();

		return 0;
	}

	static draw_set_circle_precision([_]) {
		throw new EngineException("Function draw_set_circle_precision is not implemented");
		// return 0;
	}

	static draw_arrow([_]) {
		throw new EngineException("Function draw_arrow is not implemented");
		// return 0;
	}

	static draw_button([_]) {
		throw new EngineException("Function draw_button is not implemented");
		// return 0;
	}

	static draw_path([_]) {
		throw new EngineException("Function draw_path is not implemented");
		// return 0;
	}

	static draw_healthbar([_]) {
		throw new EngineException("Function draw_healthbar is not implemented");
		// return 0;
	}

	static draw_set_color([color]) {
		this.game.drawColor = color;
		return 0;
	}

	static draw_set_alpha([alpha]) {
		this.game.drawAlpha = alpha;
		return 0;
	}

	static draw_get_color([]) {
		return this.game.drawColor;
	}

	static draw_get_alpha([]) {
		return this.game.drawAlpha;
	}

	static make_color_rgb([red, green, blue]) {
		return red*256 + green*256*256 + blue*256*256*256;
	}

	static make_color_hsv([_]) {
		throw new EngineException("Function make_color_hsv is not implemented");
		// return 0;
	}

	static color_get_red([col]) {
		return col % 256;
	}

	static color_get_green([col]) {
		return Math.floor(col % (256*256) / 256);
	}

	static color_get_blue([col]) {
		return Math.floor(col % (256*256*256) / (256*256));
	}

	static color_get_hue([col]) {
		return decimalColorToHSVValues(col).h;
	}

	static color_get_saturation([col]) {
		return decimalColorToHSVValues(col).s;
	}

	static color_get_value([col]) {
		return decimalColorToHSVValues(col).v;
	}

	static merge_color([_]) {
		throw new EngineException("Function merge_color is not implemented");
		// return 0;
	}

	static draw_getpixel([x, y]) {
		const data = this.game.ctx.getImageData(x, y, 1, 1);
		return rgbValuesToDecimalColor(data[0], data[1], data[2]);
	}

	static screen_save([_]) {
		throw new EngineException("Function screen_save is not implemented");
		// return 0;
	}

	static screen_save_part([_]) {
		throw new EngineException("Function screen_save_part is not implemented");
		// return 0;
	}

	// ## Fonts and text

	static draw_set_font([font]) {
		this.game.drawFont = font;
		return 0;
	}

	static draw_set_halign([halign]) {
		this.game.drawHAlign = halign;
		return 0;
	}

	static draw_set_valign([valign]) {
		this.game.drawVAlign = valign;
		return 0;
	}

	static draw_text([x, y, string]) {
		// TODO do this for EVERY function?
		x = forceReal(x);
		y = forceReal(y);
		string = asString(string);

		this.game.ctx.fillStyle = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);

		this.game.ctx.font = this.game.cssFontsCache[this.game.drawFont];

		// holy shit now this is epic
		this.game.ctx.textAlign = (["left", "center", "right"])[this.game.drawHAlign];
		this.game.ctx.textBaseline = (["top", "middle", "bottom"])[this.game.drawVAlign];

		// Look, I tried making this be like GM but it just doesn't add up. Hopefully will be fixed if and when we change to a custom font renderer

		// Calculate heights and initial y
		const textMetrics = this.game.ctx.measureText("");
		const height = Math.abs(textMetrics.fontBoundingBoxDescent) + Math.abs(textMetrics.fontBoundingBoxAscent);

		const lines = parseNewLineHash(string).split("\n");

		let currentY;
		if (this.game.drawVAlign == 0) { // top
			currentY = y;
		} else if (this.game.drawVAlign == 1) { // middle
			currentY = y - (height * lines.length)/2;
		} else if (this.game.drawVAlign == 2) { // bottom
			currentY = y - (height * lines.length);
		}

		for (const line of lines) {
			this.game.ctx.fillText(line, x, currentY);
			currentY += height;
		}
		return 0;
	}

	static draw_text_ext([_]) {
		throw new EngineException("Function draw_text_ext is not implemented");
		// return 0;
	}

	static string_width([_]) {
		throw new EngineException("Function string_width is not implemented");
		// return 0;
	}

	static string_width_ext([_]) {
		throw new EngineException("Function string_width_ext is not implemented");
		// return 0;
	}

	static string_height([_]) {
		throw new EngineException("Function string_height is not implemented");
		// return 0;
	}

	static string_height_ext([_]) {
		throw new EngineException("Function string_height_ext is not implemented");
		// return 0;
	}

	static draw_text_transformed([_]) {
		throw new EngineException("Function draw_text_transformed is not implemented");
		// return 0;
	}

	static draw_text_ext_transformed([_]) {
		throw new EngineException("Function draw_text_ext_transformed is not implemented");
		// return 0;
	}

	static draw_text_color([_]) {
		throw new EngineException("Function draw_text_color is not implemented");
		// return 0;
	}

	static draw_text_ext_color([_]) {
		throw new EngineException("Function draw_text_ext_color is not implemented");
		// return 0;
	}

	static draw_text_transformed_color([_]) {
		throw new EngineException("Function draw_text_transformed_color is not implemented");
		// return 0;
	}

	static draw_text_ext_transformed_color([_]) {
		throw new EngineException("Function draw_text_ext_transformed_color is not implemented");
		// return 0;
	}

	// ## Advanced drawing functions

	static draw_point_color([x, y, col1]) {
		this.game.ctx.fillStyle = decimalColorToRGB(col1);
		this.game.ctx.fillRect(x, y, 1, 1);
		return 0;
	}

	static draw_line_color([_]) {
		throw new EngineException("Function draw_line_color is not implemented");
		// return 0;
	}

	static draw_line_width_color([_]) {
		throw new EngineException("Function draw_line_width_color is not implemented");
		// return 0;
	}

	static draw_rectangle_color([_]) {
		throw new EngineException("Function draw_rectangle_color is not implemented");
		// return 0;
	}

	static draw_roundrect_color([_]) {
		throw new EngineException("Function draw_roundrect_color is not implemented");
		// return 0;
	}

	static draw_triangle_color([_]) {
		throw new EngineException("Function draw_triangle_color is not implemented");
		// return 0;
	}

	static draw_circle_color([_]) {
		throw new EngineException("Function draw_circle_color is not implemented");
		// return 0;
	}

	static draw_ellipse_color([_]) {
		throw new EngineException("Function draw_ellipse_color is not implemented");
		// return 0;
	}

	static draw_primitive_begin([_]) {
		throw new EngineException("Function draw_primitive_begin is not implemented");
		// return 0;
	}

	static draw_vertex([_]) {
		throw new EngineException("Function draw_vertex is not implemented");
		// return 0;
	}

	static draw_vertex_color([_]) {
		throw new EngineException("Function draw_vertex_color is not implemented");
		// return 0;
	}

	static draw_primitive_end([_]) {
		throw new EngineException("Function draw_primitive_end is not implemented");
		// return 0;
	}

	static sprite_get_texture([_]) {
		throw new EngineException("Function sprite_get_texture is not implemented");
		// return 0;
	}

	static background_get_texture([_]) {
		throw new EngineException("Function background_get_texture is not implemented");
		// return 0;
	}

	static texture_preload([_]) {
		throw new EngineException("Function texture_preload is not implemented");
		// return 0;
	}

	static texture_set_priority([_]) {
		throw new EngineException("Function texture_set_priority is not implemented");
		// return 0;
	}

	static texture_get_width([_]) {
		throw new EngineException("Function texture_get_width is not implemented");
		// return 0;
	}

	static texture_get_height([_]) {
		throw new EngineException("Function texture_get_height is not implemented");
		// return 0;
	}

	static draw_primitive_begin_texture([_]) {
		throw new EngineException("Function draw_primitive_begin_texture is not implemented");
		// return 0;
	}

	static draw_vertex_texture([_]) {
		throw new EngineException("Function draw_vertex_texture is not implemented");
		// return 0;
	}

	static draw_vertex_texture_color([_]) {
		throw new EngineException("Function draw_vertex_texture_color is not implemented");
		// return 0;
	}

	// static draw_primitive_end ([_]) {} // repeated

	static texture_set_interpolation([_]) {
		throw new EngineException("Function texture_set_interpolation is not implemented");
		// return 0;
	}

	static texture_set_blending([_]) {
		throw new EngineException("Function texture_set_blending is not implemented");
		// return 0;
	}

	static texture_set_repeat([_]) {
		throw new EngineException("Function texture_set_repeat is not implemented");
		// return 0;
	}

	static draw_set_blend_mode([]) {
		throw new EngineException("Function draw_set_blend_mode is not implemented");
		// return 0;
	}

	static draw_set_blend_mode_ext([src, dest]) {
		this.game.drawBlendModeSrc = src;
		this.game.drawBlendModeDest = dest;
		return 0;
	}

	// ## Drawing surfaces

	static surface_create([_]) {
		throw new EngineException("Function surface_create is not implemented");
		// return 0;
	}

	static surface_free([_]) {
		throw new EngineException("Function surface_free is not implemented");
		// return 0;
	}

	static surface_exists([_]) {
		throw new EngineException("Function surface_exists is not implemented");
		// return 0;
	}

	static surface_get_width([_]) {
		throw new EngineException("Function surface_get_width is not implemented");
		// return 0;
	}

	static surface_get_height([_]) {
		throw new EngineException("Function surface_get_height is not implemented");
		// return 0;
	}

	static surface_get_texture([_]) {
		throw new EngineException("Function surface_get_texture is not implemented");
		// return 0;
	}

	static surface_set_target([_]) {
		throw new EngineException("Function surface_set_target is not implemented");
		// return 0;
	}

	static surface_reset_target([_]) {
		throw new EngineException("Function surface_reset_target is not implemented");
		// return 0;
	}

	static surface_getpixel([_]) {
		throw new EngineException("Function surface_getpixel is not implemented");
		// return 0;
	}

	static surface_save([_]) {
		throw new EngineException("Function surface_save is not implemented");
		// return 0;
	}

	static surface_save_part([_]) {
		throw new EngineException("Function surface_save_part is not implemented");
		// return 0;
	}

	static draw_surface([_]) {
		throw new EngineException("Function draw_surface is not implemented");
		// return 0;
	}

	static draw_surface_stretched([_]) {
		throw new EngineException("Function draw_surface_stretched is not implemented");
		// return 0;
	}

	static draw_surface_tiled([_]) {
		throw new EngineException("Function draw_surface_tiled is not implemented");
		// return 0;
	}

	static draw_surface_part([_]) {
		throw new EngineException("Function draw_surface_part is not implemented");
		// return 0;
	}

	static draw_surface_ext([_]) {
		throw new EngineException("Function draw_surface_ext is not implemented");
		// return 0;
	}

	static draw_surface_stretched_ext([_]) {
		throw new EngineException("Function draw_surface_stretched_ext is not implemented");
		// return 0;
	}

	static draw_surface_tiled_ext([_]) {
		throw new EngineException("Function draw_surface_tiled_ext is not implemented");
		// return 0;
	}

	static draw_surface_part_ext([_]) {
		throw new EngineException("Function draw_surface_part_ext is not implemented");
		// return 0;
	}

	static draw_surface_general([_]) {
		throw new EngineException("Function draw_surface_general is not implemented");
		// return 0;
	}

	static surface_copy([_]) {
		throw new EngineException("Function surface_copy is not implemented");
		// return 0;
	}

	static surface_copy_part([_]) {
		throw new EngineException("Function surface_copy_part is not implemented");
		// return 0;
	}

	// ## Tiles

	static tile_add([_]) {
		throw new EngineException("Function tile_add is not implemented");
		// return 0;
	}

	static tile_delete([_]) {
		throw new EngineException("Function tile_delete is not implemented");
		// return 0;
	}

	static tile_exists([_]) {
		throw new EngineException("Function tile_exists is not implemented");
		// return 0;
	}

	static tile_get_x([_]) {
		throw new EngineException("Function tile_get_x is not implemented");
		// return 0;
	}

	static tile_get_y([_]) {
		throw new EngineException("Function tile_get_y is not implemented");
		// return 0;
	}

	static tile_get_left([_]) {
		throw new EngineException("Function tile_get_left is not implemented");
		// return 0;
	}

	static tile_get_top([_]) {
		throw new EngineException("Function tile_get_top is not implemented");
		// return 0;
	}

	static tile_get_width([_]) {
		throw new EngineException("Function tile_get_width is not implemented");
		// return 0;
	}

	static tile_get_height([_]) {
		throw new EngineException("Function tile_get_height is not implemented");
		// return 0;
	}

	static tile_get_depth([_]) {
		throw new EngineException("Function tile_get_depth is not implemented");
		// return 0;
	}

	static tile_get_visible([_]) {
		throw new EngineException("Function tile_get_visible is not implemented");
		// return 0;
	}

	static tile_get_xscale([_]) {
		throw new EngineException("Function tile_get_xscale is not implemented");
		// return 0;
	}

	static tile_get_yscale([_]) {
		throw new EngineException("Function tile_get_yscale is not implemented");
		// return 0;
	}

	static tile_get_background([_]) {
		throw new EngineException("Function tile_get_background is not implemented");
		// return 0;
	}

	static tile_get_blend([_]) {
		throw new EngineException("Function tile_get_blend is not implemented");
		// return 0;
	}

	static tile_get_alpha([_]) {
		throw new EngineException("Function tile_get_alpha is not implemented");
		// return 0;
	}

	static tile_set_position([_]) {
		throw new EngineException("Function tile_set_position is not implemented");
		// return 0;
	}

	static tile_set_region([_]) {
		throw new EngineException("Function tile_set_region is not implemented");
		// return 0;
	}

	static tile_set_background([_]) {
		throw new EngineException("Function tile_set_background is not implemented");
		// return 0;
	}

	static tile_set_visible([_]) {
		throw new EngineException("Function tile_set_visible is not implemented");
		// return 0;
	}

	static tile_set_depth([_]) {
		throw new EngineException("Function tile_set_depth is not implemented");
		// return 0;
	}

	static tile_set_scale([_]) {
		throw new EngineException("Function tile_set_scale is not implemented");
		// return 0;
	}

	static tile_set_blend([_]) {
		throw new EngineException("Function tile_set_blend is not implemented");
		// return 0;
	}

	static tile_set_alpha([_]) {
		throw new EngineException("Function tile_set_alpha is not implemented");
		// return 0;
	}

	static tile_layer_hide([_]) {
		throw new EngineException("Function tile_layer_hide is not implemented");
		// return 0;
	}

	static tile_layer_show([_]) {
		throw new EngineException("Function tile_layer_show is not implemented");
		// return 0;
	}

	static tile_layer_delete([_]) {
		throw new EngineException("Function tile_layer_delete is not implemented");
		// return 0;
	}

	static tile_layer_shift([_]) {
		throw new EngineException("Function tile_layer_shift is not implemented");
		// return 0;
	}

	static tile_layer_find([_]) {
		throw new EngineException("Function tile_layer_find is not implemented");
		// return 0;
	}

	static tile_layer_delete_at([_]) {
		throw new EngineException("Function tile_layer_delete_at is not implemented");
		// return 0;
	}

	static tile_layer_depth([_]) {
		throw new EngineException("Function tile_layer_depth is not implemented");
		// return 0;
	}

	// ## The display

	static display_get_width([_]) {
		throw new EngineException("Function display_get_width is not implemented");
		// return 0;
	}

	static display_get_height([_]) {
		throw new EngineException("Function display_get_height is not implemented");
		// return 0;
	}

	static display_get_colordepth([_]) {
		throw new EngineException("Function display_get_colordepth is not implemented");
		// return 0;
	}

	static display_get_frequency([_]) {
		throw new EngineException("Function display_get_frequency is not implemented");
		// return 0;
	}

	static display_set_size([_]) {
		throw new EngineException("Function display_set_size is not implemented");
		// return 0;
	}

	static display_set_colordepth([_]) {
		throw new EngineException("Function display_set_colordepth is not implemented");
		// return 0;
	}

	static display_set_frequency([_]) {
		throw new EngineException("Function display_set_frequency is not implemented");
		// return 0;
	}

	static display_set_all([_]) {
		throw new EngineException("Function display_set_all is not implemented");
		// return 0;
	}

	static display_test_all([_]) {
		throw new EngineException("Function display_test_all is not implemented");
		// return 0;
	}

	static display_reset([_]) {
		throw new EngineException("Function display_reset is not implemented");
		// return 0;
	}

	static display_mouse_get_x([_]) {
		throw new EngineException("Function display_mouse_get_x is not implemented");
		// return 0;
	}

	static display_mouse_get_y([_]) {
		throw new EngineException("Function display_mouse_get_y is not implemented");
		// return 0;
	}

	static display_mouse_set([_]) {
		throw new EngineException("Function display_mouse_set is not implemented");
		// return 0;
	}

	// ## The window

	static window_set_visible([_]) {
		throw new EngineException("Function window_set_visible is not implemented");
		// return 0;
	}

	static window_get_visible([_]) {
		throw new EngineException("Function window_get_visible is not implemented");
		// return 0;
	}

	static async window_set_fullscreen([full]) {
		full = (forceReal(full) > 0.5);
		await this.game.setFullscreen(full);
		return 0;
	}

	static window_get_fullscreen([]) {
		return this.game.getFullscreen() ? 1 : 0;
	}

	static window_set_showborder([_]) {
		throw new EngineException("Function window_set_showborder is not implemented");
		// return 0;
	}

	static window_get_showborder([_]) {
		throw new EngineException("Function window_get_showborder is not implemented");
		// return 0;
	}

	static window_set_showicons([_]) {
		throw new EngineException("Function window_set_showicons is not implemented");
		// return 0;
	}

	static window_get_showicons([_]) {
		throw new EngineException("Function window_get_showicons is not implemented");
		// return 0;
	}

	static window_set_stayontop([_]) {
		throw new EngineException("Function window_set_stayontop is not implemented");
		// return 0;
	}

	static window_get_stayontop([_]) {
		throw new EngineException("Function window_get_stayontop is not implemented");
		// return 0;
	}

	static window_set_sizeable([_]) {
		throw new EngineException("Function window_set_sizeable is not implemented");
		// return 0;
	}

	static window_get_sizeable([_]) {
		throw new EngineException("Function window_get_sizeable is not implemented");
		// return 0;
	}

	static window_set_caption([_]) {
		throw new EngineException("Function window_set_caption is not implemented");
		// return 0;
	}

	static window_get_caption([_]) {
		throw new EngineException("Function window_get_caption is not implemented");
		// return 0;
	}

	static window_set_cursor([_]) {
		throw new EngineException("Function window_set_cursor is not implemented");
		// return 0;
	}

	static window_get_cursor([_]) {
		throw new EngineException("Function window_get_cursor is not implemented");
		// return 0;
	}

	static window_set_color([_]) {
		throw new EngineException("Function window_set_color is not implemented");
		// return 0;
	}

	static window_get_color([_]) {
		throw new EngineException("Function window_get_color is not implemented");
		// return 0;
	}

	static window_set_region_scale([_]) {
		throw new EngineException("Function window_set_region_scale is not implemented");
		// return 0;
	}

	static window_get_region_scale([_]) {
		throw new EngineException("Function window_get_region_scale is not implemented");
		// return 0;
	}

	static window_set_position([_]) {
		throw new EngineException("Function window_set_position is not implemented");
		// return 0;
	}

	static window_set_size([_]) {
		throw new EngineException("Function window_set_size is not implemented");
		// return 0;
	}

	static window_set_rectangle([_]) {
		throw new EngineException("Function window_set_rectangle is not implemented");
		// return 0;
	}

	static window_center([_]) {
		throw new EngineException("Function window_center is not implemented");
		// return 0;
	}

	static window_default([_]) {
		throw new EngineException("Function window_default is not implemented");
		// return 0;
	}

	static window_get_x([_]) {
		throw new EngineException("Function window_get_x is not implemented");
		// return 0;
	}

	static window_get_y([_]) {
		throw new EngineException("Function window_get_y is not implemented");
		// return 0;
	}

	static window_get_width([_]) {
		throw new EngineException("Function window_get_width is not implemented");
		// return 0;
	}

	static window_get_height([_]) {
		throw new EngineException("Function window_get_height is not implemented");
		// return 0;
	}

	static window_mouse_get_x([_]) {
		throw new EngineException("Function window_mouse_get_x is not implemented");
		// return 0;
	}

	static window_mouse_get_y([_]) {
		throw new EngineException("Function window_mouse_get_y is not implemented");
		// return 0;
	}

	static window_mouse_set([_]) {
		throw new EngineException("Function window_mouse_set is not implemented");
		// return 0;
	}

	// ## Views

	static window_set_region_size([_]) {
		throw new EngineException("Function window_set_region_size is not implemented");
		// return 0;
	}

	static window_get_region_width([_]) {
		throw new EngineException("Function window_get_region_width is not implemented");
		// return 0;
	}

	static window_get_region_height([_]) {
		throw new EngineException("Function window_get_region_height is not implemented");
		// return 0;
	}

	static window_view_mouse_get_x([_]) {
		throw new EngineException("Function window_view_mouse_get_x is not implemented");
		// return 0;
	}

	static window_view_mouse_get_y([_]) {
		throw new EngineException("Function window_view_mouse_get_y is not implemented");
		// return 0;
	}

	static window_view_mouse_set([_]) {
		throw new EngineException("Function window_view_mouse_set is not implemented");
		// return 0;
	}

	static window_views_mouse_get_x([_]) {
		throw new EngineException("Function window_views_mouse_get_x is not implemented");
		// return 0;
	}

	static window_views_mouse_get_y([_]) {
		throw new EngineException("Function window_views_mouse_get_y is not implemented");
		// return 0;
	}

	static window_views_mouse_set([_]) {
		throw new EngineException("Function window_views_mouse_set is not implemented");
		// return 0;
	}

	// ## Repainting the screen

	static screen_redraw([_]) {
		throw new EngineException("Function screen_redraw is not implemented");
		// return 0;
	}

	static screen_refresh([_]) {
		throw new EngineException("Function screen_refresh is not implemented");
		// return 0;
	}

	static set_automatic_draw([_]) {
		throw new EngineException("Function set_automatic_draw is not implemented");
		// return 0;
	}

	static set_synchronization([_]) {
		throw new EngineException("Function set_synchronization is not implemented");
		// return 0;
	}

	static screen_wait_vsync([_]) {
		throw new EngineException("Function screen_wait_vsync is not implemented");
		// return 0;
	}

	// # Sound and music

	// ## Basic sound functions

	static sound_play([index]) {
		const sound = this.game.getResourceById("ProjectSound", index);
		if (!sound) {
			throw this.game.makeNonFatalError({
				type: "sound_does_not_exist",
				soundIndex: index,
			}, "Sound does not exist. (" + index.toString() +")");
		}

		this.game.playSound(sound, false);
		return 0;
	}

	static sound_loop([index]) {
		const sound = this.game.getResourceById("ProjectSound", index);
		if (!sound) {
			throw this.game.makeNonFatalError({
				type: "sound_does_not_exist",
				soundIndex: index,
			}, "Sound does not exist. (" + index.toString() +")");
		}

		this.game.playSound(sound, true);
		return 0;
	}

	static sound_stop([index]) {
		const sound = this.game.getResourceById("ProjectSound", index);
		if (!sound) {
			throw this.game.makeNonFatalError({
				type: "sound_does_not_exist",
				soundIndex: index,
			}, "Sound does not exist. (" + index.toString() +")");
		}

		this.game.stopSound(sound);
	}

	static sound_stop_all([]) {
		this.game.stopAllSounds();
		return 0;
	}

	static sound_isplaying([index]) {
		const sound = this.game.getResourceById("ProjectSound", index);
		if (!sound) return 0;

		for (const audioNode of this.game.sounds.get(sound).audioNodes) {
			if (!audioNode.mediaElement.ended) {
				return 1;
			}
		}

		return 0;
	}

	static sound_volume([index, value]) {
		const sound = this.game.getResourceById("ProjectSound", index);
		if (!sound) return 0; // TODO check if error

		this.game.sounds.get(sound).volume = value;

		for (const audioNode of this.game.sounds.get(sound).audioNodes) {
			audioNode.mediaElement.volume = value;
		}

		return 0;
	}

	static sound_global_volume([_]) {
		throw new EngineException("Function sound_global_volume is not implemented");
		// return 0;
	}

	static sound_fade([_]) {
		throw new EngineException("Function sound_fade is not implemented");
		// return 0;
	}

	static sound_pan([_]) {
		throw new EngineException("Function sound_pan is not implemented");
		// return 0;
	}

	static sound_background_tempo([_]) {
		throw new EngineException("Function sound_background_tempo is not implemented");
		// return 0;
	}

	static sound_set_search_directory([_]) {
		throw new EngineException("Function sound_set_search_directory is not implemented");
		// return 0;
	}

	// ## Sound effects

	static sound_effect_set([_]) {
		throw new EngineException("Function sound_effect_set is not implemented");
		// return 0;
	}

	static sound_effect_chorus([_]) {
		throw new EngineException("Function sound_effect_chorus is not implemented");
		// return 0;
	}

	static sound_effect_echo([_]) {
		throw new EngineException("Function sound_effect_echo is not implemented");
		// return 0;
	}

	static sound_effect_flanger([_]) {
		throw new EngineException("Function sound_effect_flanger is not implemented");
		// return 0;
	}

	static sound_effect_gargle([_]) {
		throw new EngineException("Function sound_effect_gargle is not implemented");
		// return 0;
	}

	static sound_effect_reverb([_]) {
		throw new EngineException("Function sound_effect_reverb is not implemented");
		// return 0;
	}

	static sound_effect_compressor([_]) {
		throw new EngineException("Function sound_effect_compressor is not implemented");
		// return 0;
	}

	static sound_effect_equalizer([_]) {
		throw new EngineException("Function sound_effect_equalizer is not implemented");
		// return 0;
	}

	// ## 3D sound

	static sound_3d_set_sound_position([_]) {
		throw new EngineException("Function sound_3d_set_sound_position is not implemented");
		// return 0;
	}

	static sound_3d_set_sound_velocity([_]) {
		throw new EngineException("Function sound_3d_set_sound_velocity is not implemented");
		// return 0;
	}

	static sound_3d_set_sound_distance([_]) {
		throw new EngineException("Function sound_3d_set_sound_distance is not implemented");
		// return 0;
	}

	static sound_3d_set_sound_cone([_]) {
		throw new EngineException("Function sound_3d_set_sound_cone is not implemented");
		// return 0;
	}

	// ## CD music

	static cd_init([_]) {
		throw new EngineException("Function cd_init is not implemented");
		// return 0;
	}

	static cd_present([_]) {
		throw new EngineException("Function cd_present is not implemented");
		// return 0;
	}

	static cd_number([_]) {
		throw new EngineException("Function cd_number is not implemented");
		// return 0;
	}

	static cd_playing([_]) {
		throw new EngineException("Function cd_playing is not implemented");
		// return 0;
	}

	static cd_paused([_]) {
		throw new EngineException("Function cd_paused is not implemented");
		// return 0;
	}

	static cd_track([_]) {
		throw new EngineException("Function cd_track is not implemented");
		// return 0;
	}

	static cd_length([_]) {
		throw new EngineException("Function cd_length is not implemented");
		// return 0;
	}

	static cd_track_length([_]) {
		throw new EngineException("Function cd_track_length is not implemented");
		// return 0;
	}

	static cd_position([_]) {
		throw new EngineException("Function cd_position is not implemented");
		// return 0;
	}

	static cd_track_position([_]) {
		throw new EngineException("Function cd_track_position is not implemented");
		// return 0;
	}

	static cd_play([_]) {
		throw new EngineException("Function cd_play is not implemented");
		// return 0;
	}

	static cd_stop([_]) {
		throw new EngineException("Function cd_stop is not implemented");
		// return 0;
	}

	static cd_pause([_]) {
		throw new EngineException("Function cd_pause is not implemented");
		// return 0;
	}

	static cd_resume([_]) {
		throw new EngineException("Function cd_resume is not implemented");
		// return 0;
	}

	static cd_set_position([_]) {
		throw new EngineException("Function cd_set_position is not implemented");
		// return 0;
	}

	static cd_set_track_position([_]) {
		throw new EngineException("Function cd_set_track_position is not implemented");
		// return 0;
	}

	static cd_open_door([_]) {
		throw new EngineException("Function cd_open_door is not implemented");
		// return 0;
	}

	static cd_close_door([_]) {
		throw new EngineException("Function cd_close_door is not implemented");
		// return 0;
	}

	static MCI_command([_]) {
		throw new EngineException("Function MCI_command is not implemented");
		// return 0;
	}

	// # Splash screens, highscores, and other pop-ups

	// ## Splash screens

	static splash_show_video([_]) {
		throw new EngineException("Function splash_show_video is not implemented");
		// return 0;
	}

	static splash_show_text([_]) {
		throw new EngineException("Function splash_show_text is not implemented");
		// return 0;
	}

	static splash_show_image([_]) {
		throw new EngineException("Function splash_show_image is not implemented");
		// return 0;
	}

	static splash_show_web([_]) {
		throw new EngineException("Function splash_show_web is not implemented");
		// return 0;
	}

	static splash_set_main([_]) {
		throw new EngineException("Function splash_set_main is not implemented");
		// return 0;
	}

	static splash_set_scale([_]) {
		throw new EngineException("Function splash_set_scale is not implemented");
		// return 0;
	}

	static splash_set_cursor([_]) {
		throw new EngineException("Function splash_set_cursor is not implemented");
		// return 0;
	}

	static splash_set_color([_]) {
		throw new EngineException("Function splash_set_color is not implemented");
		// return 0;
	}

	static splash_set_caption([_]) {
		throw new EngineException("Function splash_set_caption is not implemented");
		// return 0;
	}

	static splash_set_fullscreen([_]) {
		throw new EngineException("Function splash_set_fullscreen is not implemented");
		// return 0;
	}

	static splash_set_border([_]) {
		throw new EngineException("Function splash_set_border is not implemented");
		// return 0;
	}

	static splash_set_size([_]) {
		throw new EngineException("Function splash_set_size is not implemented");
		// return 0;
	}

	static splash_set_position([_]) {
		throw new EngineException("Function splash_set_position is not implemented");
		// return 0;
	}

	static splash_set_adapt([_]) {
		throw new EngineException("Function splash_set_adapt is not implemented");
		// return 0;
	}

	static splash_set_top([_]) {
		throw new EngineException("Function splash_set_top is not implemented");
		// return 0;
	}

	static splash_set_interrupt([_]) {
		throw new EngineException("Function splash_set_interrupt is not implemented");
		// return 0;
	}

	static splash_set_stop_key([_]) {
		throw new EngineException("Function splash_set_stop_key is not implemented");
		// return 0;
	}

	static splash_set_stop_mouse([_]) {
		throw new EngineException("Function splash_set_stop_mouse is not implemented");
		// return 0;
	}

	static splash_set_close_button([_]) {
		throw new EngineException("Function splash_set_close_button is not implemented");
		// return 0;
	}

	static show_info([_]) {
		throw new EngineException("Function show_info is not implemented");
		// return 0;
	}

	static load_info([_]) {
		throw new EngineException("Function load_info is not implemented");
		// return 0;
	}

	// ## Pop-up messages and questions

	static show_message([str]) {
		str = asString(str);
		this.game.clearIO();
		alert(parseNewLineHash(str));
		return 0;
	}

	static show_message_ext([_]) {
		throw new EngineException("Function show_message_ext is not implemented");
		// return 0;
	}

	static show_question([str]) {
		this.game.clearIO();
		return confirm(str) ? 1 : 0;
	}

	static get_integer([str, def]) {
		str = forceString(str);
		def = forceInteger(def);

		const result = prompt(str, def);
		if (result === null) return def;

		const value = parseFloat(result);
		if (Number.isNaN(value)) return def;

		return toInteger(value);
	}

	static get_string([str, def]) {
		str = forceString(str);
		def = forceString(def);

		const result = prompt(str, def);
		if (result === null) return def;

		return result;
	}

	static message_background([_]) {
		throw new EngineException("Function message_background is not implemented");
		// return 0;
	}

	static message_alpha([_]) {
		throw new EngineException("Function message_alpha is not implemented");
		// return 0;
	}

	static message_button([_]) {
		throw new EngineException("Function message_button is not implemented");
		// return 0;
	}

	static message_text_font([_]) {
		throw new EngineException("Function message_text_font is not implemented");
		// return 0;
	}

	static message_button_font([_]) {
		throw new EngineException("Function message_button_font is not implemented");
		// return 0;
	}

	static message_input_font([_]) {
		throw new EngineException("Function message_input_font is not implemented");
		// return 0;
	}

	static message_mouse_color([_]) {
		throw new EngineException("Function message_mouse_color is not implemented");
		// return 0;
	}

	static message_input_color([_]) {
		throw new EngineException("Function message_input_color is not implemented");
		// return 0;
	}

	static message_caption([_]) {
		throw new EngineException("Function message_caption is not implemented");
		// return 0;
	}

	static message_position([_]) {
		throw new EngineException("Function message_position is not implemented");
		// return 0;
	}

	static message_size([_]) {
		throw new EngineException("Function message_size is not implemented");
		// return 0;
	}

	static show_menu([_]) {
		throw new EngineException("Function show_menu is not implemented");
		// return 0;
	}

	static show_menu_pos([_]) {
		throw new EngineException("Function show_menu_pos is not implemented");
		// return 0;
	}

	static get_color([_]) {
		throw new EngineException("Function get_color is not implemented");
		// return 0;
	}

	static get_open_filename([_]) {
		throw new EngineException("Function get_open_filename is not implemented");
		// return 0;
	}

	static get_save_filename([_]) {
		throw new EngineException("Function get_save_filename is not implemented");
		// return 0;
	}

	static get_directory([_]) {
		throw new EngineException("Function get_directory is not implemented");
		// return 0;
	}

	static get_directory_alt([_]) {
		throw new EngineException("Function get_directory_alt is not implemented");
		// return 0;
	}

	static show_error([_]) {
		throw new EngineException("Function show_error is not implemented");
		// return 0;
	}

	// ## Highscore list

	static highscore_show([_]) {
		throw new EngineException("Function highscore_show is not implemented");
		// return 0;
	}

	static highscore_set_background([_]) {
		throw new EngineException("Function highscore_set_background is not implemented");
		// return 0;
	}

	static highscore_set_border([_]) {
		throw new EngineException("Function highscore_set_border is not implemented");
		// return 0;
	}

	static highscore_set_font([_]) {
		throw new EngineException("Function highscore_set_font is not implemented");
		// return 0;
	}

	static highscore_set_colors([_]) {
		throw new EngineException("Function highscore_set_colors is not implemented");
		// return 0;
	}

	static highscore_set_strings([_]) {
		throw new EngineException("Function highscore_set_strings is not implemented");
		// return 0;
	}

	static highscore_show_ext([_]) {
		throw new EngineException("Function highscore_show_ext is not implemented");
		// return 0;
	}

	static highscore_clear([_]) {
		throw new EngineException("Function highscore_clear is not implemented");
		// return 0;
	}

	static highscore_add([_]) {
		throw new EngineException("Function highscore_add is not implemented");
		// return 0;
	}

	static highscore_add_current([_]) {
		throw new EngineException("Function highscore_add_current is not implemented");
		// return 0;
	}

	static highscore_value([_]) {
		throw new EngineException("Function highscore_value is not implemented");
		// return 0;
	}

	static highscore_name([_]) {
		throw new EngineException("Function highscore_name is not implemented");
		// return 0;
	}

	static draw_highscore([_]) {
		throw new EngineException("Function draw_highscore is not implemented");
		// return 0;
	}

	// # Resources

	// ## Sprites

	static sprite_exists([ind]) {
		const sprite = this.game.getResourceById("ProjectSprite", ind);
		return sprite ? 1 : 0;
	}

	static sprite_get_name([_]) {
		throw new EngineException("Function sprite_get_name is not implemented");
		// return 0;
	}

	static sprite_get_number([_]) {
		throw new EngineException("Function sprite_get_number is not implemented");
		// return 0;
	}

	static sprite_get_width([_]) {
		throw new EngineException("Function sprite_get_width is not implemented");
		// return 0;
	}

	static sprite_get_height([_]) {
		throw new EngineException("Function sprite_get_height is not implemented");
		// return 0;
	}

	static sprite_get_xoffset([_]) {
		throw new EngineException("Function sprite_get_xoffset is not implemented");
		// return 0;
	}

	static sprite_get_yoffset([_]) {
		throw new EngineException("Function sprite_get_yoffset is not implemented");
		// return 0;
	}

	static sprite_get_bbox_left([_]) {
		throw new EngineException("Function sprite_get_bbox_left is not implemented");
		// return 0;
	}

	static sprite_get_bbox_right([_]) {
		throw new EngineException("Function sprite_get_bbox_right is not implemented");
		// return 0;
	}

	static sprite_get_bbox_top([_]) {
		throw new EngineException("Function sprite_get_bbox_top is not implemented");
		// return 0;
	}

	static sprite_get_bbox_bottom([_]) {
		throw new EngineException("Function sprite_get_bbox_bottom is not implemented");
		// return 0;
	}

	static sprite_save([_]) {
		throw new EngineException("Function sprite_save is not implemented");
		// return 0;
	}

	static sprite_save_strip([_]) {
		throw new EngineException("Function sprite_save_strip is not implemented");
		// return 0;
	}

	// ## Sounds

	static sound_exists([ind]) {
		const sound = this.game.getResourceById("ProjectSound", ind);
		return sound ? 1 : 0;
	}

	static sound_get_name([_]) {
		throw new EngineException("Function sound_get_name is not implemented");
		// return 0;
	}

	static sound_get_kind([_]) {
		throw new EngineException("Function sound_get_kind is not implemented");
		// return 0;
	}

	static sound_get_preload([_]) {
		throw new EngineException("Function sound_get_preload is not implemented");
		// return 0;
	}

	static sound_discard([_]) {
		throw new EngineException("Function sound_discard is not implemented");
		// return 0;
	}

	static sound_restore([_]) {
		throw new EngineException("Function sound_restore is not implemented");
		// return 0;
	}

	// ## Backgrounds

	static background_exists([ind]) {
		const background = this.game.getResourceById("ProjectBackground", ind);
		return background ? 1 : 0;
	}

	static background_get_name([_]) {
		throw new EngineException("Function background_get_name is not implemented");
		// return 0;
	}

	static background_get_width([_]) {
		throw new EngineException("Function background_get_width is not implemented");
		// return 0;
	}

	static background_get_height([_]) {
		throw new EngineException("Function background_get_height is not implemented");
		// return 0;
	}

	static background_save([_]) {
		throw new EngineException("Function background_save is not implemented");
		// return 0;
	}

	// ## Fonts

	static font_exists([ind]) {
		const font = this.game.getResourceById("ProjectFont", ind);
		return font ? 1 : 0;
	}

	static font_get_name([_]) {
		throw new EngineException("Function font_get_name is not implemented");
		// return 0;
	}

	static font_get_fontname([_]) {
		throw new EngineException("Function font_get_fontname is not implemented");
		// return 0;
	}

	static font_get_bold([_]) {
		throw new EngineException("Function font_get_bold is not implemented");
		// return 0;
	}

	static font_get_italic([_]) {
		throw new EngineException("Function font_get_italic is not implemented");
		// return 0;
	}

	static font_get_first([_]) {
		throw new EngineException("Function font_get_first is not implemented");
		// return 0;
	}

	static font_get_last([_]) {
		throw new EngineException("Function font_get_last is not implemented");
		// return 0;
	}

	// ## Paths

	static path_exists([ind]) {
		const path = this.game.getResourceById("ProjectPath", ind);
		return path ? 1 : 0;
	}

	static path_get_name([_]) {
		throw new EngineException("Function path_get_name is not implemented");
		// return 0;
	}

	static path_get_length([_]) {
		throw new EngineException("Function path_get_length is not implemented");
		// return 0;
	}

	static path_get_kind([_]) {
		throw new EngineException("Function path_get_kind is not implemented");
		// return 0;
	}

	static path_get_closed([_]) {
		throw new EngineException("Function path_get_closed is not implemented");
		// return 0;
	}

	static path_get_precision([_]) {
		throw new EngineException("Function path_get_precision is not implemented");
		// return 0;
	}

	static path_get_number([_]) {
		throw new EngineException("Function path_get_number is not implemented");
		// return 0;
	}

	static path_get_point_x([_]) {
		throw new EngineException("Function path_get_point_x is not implemented");
		// return 0;
	}

	static path_get_point_y([_]) {
		throw new EngineException("Function path_get_point_y is not implemented");
		// return 0;
	}

	static path_get_point_speed([_]) {
		throw new EngineException("Function path_get_point_speed is not implemented");
		// return 0;
	}

	static path_get_x([_]) {
		throw new EngineException("Function path_get_x is not implemented");
		// return 0;
	}

	static path_get_y([_]) {
		throw new EngineException("Function path_get_y is not implemented");
		// return 0;
	}

	static path_get_speed([_]) {
		throw new EngineException("Function path_get_speed is not implemented");
		// return 0;
	}

	// ## Scripts

	static script_exists([ind]) {
		const script = this.game.getResourceById("ProjectScript", ind);
		return script ? 1 : 0;
	}

	static script_get_name([_]) {
		throw new EngineException("Function script_get_name is not implemented");
		// return 0;
	}

	static script_get_text([_]) {
		throw new EngineException("Function script_get_text is not implemented");
		// return 0;
	}

	// ## Time lines

	static timeline_exists([ind]) {
		const timeline = this.game.getResourceById("ProjectTimeline", ind);
		return timeline ? 1 : 0;
	}

	static timeline_get_name([_]) {
		throw new EngineException("Function timeline_get_name is not implemented");
		// return 0;
	}

	// ## Objects

	static object_exists([ind]) {
		const object = this.game.getResourceById("ProjectObject", ind);
		return object ? 1 : 0;
	}

	static object_get_name([_]) {
		throw new EngineException("Function object_get_name is not implemented");
		// return 0;
	}

	static object_get_sprite([_]) {
		throw new EngineException("Function object_get_sprite is not implemented");
		// return 0;
	}

	static object_get_solid([_]) {
		throw new EngineException("Function object_get_solid is not implemented");
		// return 0;
	}

	static object_get_visible([_]) {
		throw new EngineException("Function object_get_visible is not implemented");
		// return 0;
	}

	static object_get_depth([_]) {
		throw new EngineException("Function object_get_depth is not implemented");
		// return 0;
	}

	static object_get_persistent([_]) {
		throw new EngineException("Function object_get_persistent is not implemented");
		// return 0;
	}

	static object_get_mask([_]) {
		throw new EngineException("Function object_get_mask is not implemented");
		// return 0;
	}

	static object_get_parent([_]) {
		throw new EngineException("Function object_get_parent is not implemented");
		// return 0;
	}

	static object_is_ancestor([_]) {
		throw new EngineException("Function object_is_ancestor is not implemented");
		// return 0;
	}

	// ## Rooms

	static room_exists([ind]) {
		const room = this.game.getResourceById("ProjectRoom", ind);
		return room ? 1 : 0;
	}

	static room_get_name([_]) {
		throw new EngineException("Function room_get_name is not implemented");
		// return 0;
	}

	// # Changing resources

	// ## Sprites

	static sprite_set_offset([_]) {
		throw new EngineException("Function sprite_set_offset is not implemented");
		// return 0;
	}

	static sprite_duplicate([_]) {
		throw new EngineException("Function sprite_duplicate is not implemented");
		// return 0;
	}

	static sprite_assign([_]) {
		throw new EngineException("Function sprite_assign is not implemented");
		// return 0;
	}

	static sprite_merge([_]) {
		throw new EngineException("Function sprite_merge is not implemented");
		// return 0;
	}

	static sprite_add([_]) {
		throw new EngineException("Function sprite_add is not implemented");
		// return 0;
	}

	static sprite_replace([_]) {
		throw new EngineException("Function sprite_replace is not implemented");
		// return 0;
	}

	static sprite_add_sprite([_]) {
		throw new EngineException("Function sprite_add_sprite is not implemented");
		// return 0;
	}

	static sprite_replace_sprite([_]) {
		throw new EngineException("Function sprite_replace_sprite is not implemented");
		// return 0;
	}

	static sprite_create_from_screen([_]) {
		throw new EngineException("Function sprite_create_from_screen is not implemented");
		// return 0;
	}

	static sprite_add_from_screen([_]) {
		throw new EngineException("Function sprite_add_from_screen is not implemented");
		// return 0;
	}

	static sprite_create_from_surface([_]) {
		throw new EngineException("Function sprite_create_from_surface is not implemented");
		// return 0;
	}

	static sprite_add_from_surface([_]) {
		throw new EngineException("Function sprite_add_from_surface is not implemented");
		// return 0;
	}

	static sprite_delete([_]) {
		throw new EngineException("Function sprite_delete is not implemented");
		// return 0;
	}

	static sprite_set_alpha_from_sprite([_]) {
		throw new EngineException("Function sprite_set_alpha_from_sprite is not implemented");
		// return 0;
	}

	static sprite_collision_mask([_]) {
		throw new EngineException("Function sprite_collision_mask is not implemented");
		// return 0;
	}

	// ## Sounds

	static sound_add([_]) {
		throw new EngineException("Function sound_add is not implemented");
		// return 0;
	}

	static sound_replace([_]) {
		throw new EngineException("Function sound_replace is not implemented");
		// return 0;
	}

	static sound_delete([_]) {
		throw new EngineException("Function sound_delete is not implemented");
		// return 0;
	}

	// ## Backgrounds

	static background_duplicate([_]) {
		throw new EngineException("Function background_duplicate is not implemented");
		// return 0;
	}

	static background_assign([_]) {
		throw new EngineException("Function background_assign is not implemented");
		// return 0;
	}

	static background_add([_]) {
		throw new EngineException("Function background_add is not implemented");
		// return 0;
	}

	static background_replace([_]) {
		throw new EngineException("Function background_replace is not implemented");
		// return 0;
	}

	static background_add_background([_]) {
		throw new EngineException("Function background_add_background is not implemented");
		// return 0;
	}

	static background_replace_background([_]) {
		throw new EngineException("Function background_replace_background is not implemented");
		// return 0;
	}

	static background_create_color([_]) {
		throw new EngineException("Function background_create_color is not implemented");
		// return 0;
	}

	static background_create_gradient([_]) {
		throw new EngineException("Function background_create_gradient is not implemented");
		// return 0;
	}

	static background_create_from_screen([_]) {
		throw new EngineException("Function background_create_from_screen is not implemented");
		// return 0;
	}

	static background_create_from_surface([_]) {
		throw new EngineException("Function background_create_from_surface is not implemented");
		// return 0;
	}

	static background_delete([_]) {
		throw new EngineException("Function background_delete is not implemented");
		// return 0;
	}

	static background_set_alpha_from_background([_]) {
		throw new EngineException("Function background_set_alpha_from_background is not implemented");
		// return 0;
	}

	// ## Fonts

	static font_add([_]) {
		throw new EngineException("Function font_add is not implemented");
		// return 0;
	}

	static font_add_sprite([_]) {
		throw new EngineException("Function font_add_sprite is not implemented");
		// return 0;
	}

	static font_replace([_]) {
		throw new EngineException("Function font_replace is not implemented");
		// return 0;
	}

	static font_replace_sprite([_]) {
		throw new EngineException("Function font_replace_sprite is not implemented");
		// return 0;
	}

	static font_delete([_]) {
		throw new EngineException("Function font_delete is not implemented");
		// return 0;
	}

	// ## Paths

	static path_set_kind([_]) {
		throw new EngineException("Function path_set_kind is not implemented");
		// return 0;
	}

	static path_set_closed([_]) {
		throw new EngineException("Function path_set_closed is not implemented");
		// return 0;
	}

	static path_set_precision([_]) {
		throw new EngineException("Function path_set_precision is not implemented");
		// return 0;
	}

	static path_add([_]) {
		throw new EngineException("Function path_add is not implemented");
		// return 0;
	}

	static path_delete([_]) {
		throw new EngineException("Function path_delete is not implemented");
		// return 0;
	}

	static path_duplicate([_]) {
		throw new EngineException("Function path_duplicate is not implemented");
		// return 0;
	}

	static path_assign([_]) {
		throw new EngineException("Function path_assign is not implemented");
		// return 0;
	}

	static path_append([_]) {
		throw new EngineException("Function path_append is not implemented");
		// return 0;
	}

	static path_add_point([_]) {
		throw new EngineException("Function path_add_point is not implemented");
		// return 0;
	}

	static path_insert_point([_]) {
		throw new EngineException("Function path_insert_point is not implemented");
		// return 0;
	}

	static path_change_point([_]) {
		throw new EngineException("Function path_change_point is not implemented");
		// return 0;
	}

	static path_delete_point([_]) {
		throw new EngineException("Function path_delete_point is not implemented");
		// return 0;
	}

	static path_clear_points([_]) {
		throw new EngineException("Function path_clear_points is not implemented");
		// return 0;
	}

	static path_reverse([_]) {
		throw new EngineException("Function path_reverse is not implemented");
		// return 0;
	}

	static path_mirror([_]) {
		throw new EngineException("Function path_mirror is not implemented");
		// return 0;
	}

	static path_flip([_]) {
		throw new EngineException("Function path_flip is not implemented");
		// return 0;
	}

	static path_rotate([_]) {
		throw new EngineException("Function path_rotate is not implemented");
		// return 0;
	}

	static path_scale([_]) {
		throw new EngineException("Function path_scale is not implemented");
		// return 0;
	}

	static path_shift([_]) {
		throw new EngineException("Function path_shift is not implemented");
		// return 0;
	}

	// ## Scripts

	static async execute_string([str, ...args]) {
		await this.game.executeString(str, this.currentInstance, this.currentOther, args);
		return 0;
	}

	static execute_file([_]) {
		throw new EngineException("Function execute_file is not implemented");
		// return 0;
	}

	static script_execute([scr, ...args]) {
		const script = this.game.getResourceById("ProjectScript", scr);
		if (script) {
			return this.execute(this.game.gmlCache.get(script), this.currentInstance, this.currentOther, args);
		} else {
			throw this.game.makeNonFatalError({
					type: "trying_to_execute_non_existing_script",
					scriptIndex: scr,
				}, "Trying to execute non-existing script. (" + scr.toString() +")");
		}
	}

	// ## Time lines

	static timeline_add([_]) {
		throw new EngineException("Function timeline_add is not implemented");
		// return 0;
	}

	static timeline_delete([_]) {
		throw new EngineException("Function timeline_delete is not implemented");
		// return 0;
	}

	static timeline_clear([_]) {
		throw new EngineException("Function timeline_clear is not implemented");
		// return 0;
	}

	static timeline_moment_add([_]) {
		throw new EngineException("Function timeline_moment_add is not implemented");
		// return 0;
	}

	static timeline_moment_clear([_]) {
		throw new EngineException("Function timeline_moment_clear is not implemented");
		// return 0;
	}

	// ## Objects

	static object_set_sprite([_]) {
		throw new EngineException("Function object_set_sprite is not implemented");
		// return 0;
	}

	static object_set_solid([_]) {
		throw new EngineException("Function object_set_solid is not implemented");
		// return 0;
	}

	static object_set_visible([_]) {
		throw new EngineException("Function object_set_visible is not implemented");
		// return 0;
	}

	static object_set_depth([_]) {
		throw new EngineException("Function object_set_depth is not implemented");
		// return 0;
	}

	static object_set_persistent([_]) {
		throw new EngineException("Function object_set_persistent is not implemented");
		// return 0;
	}

	static object_set_mask([_]) {
		throw new EngineException("Function object_set_mask is not implemented");
		// return 0;
	}

	static object_set_parent([_]) {
		throw new EngineException("Function object_set_parent is not implemented");
		// return 0;
	}

	static object_add([_]) {
		throw new EngineException("Function object_add is not implemented");
		// return 0;
	}

	static object_delete([_]) {
		throw new EngineException("Function object_delete is not implemented");
		// return 0;
	}

	static object_event_add([_]) {
		throw new EngineException("Function object_event_add is not implemented");
		// return 0;
	}

	static object_event_clear([_]) {
		throw new EngineException("Function object_event_clear is not implemented");
		// return 0;
	}

	// ## Rooms

	static room_set_width([_]) {
		throw new EngineException("Function room_set_width is not implemented");
		// return 0;
	}

	static room_set_height([_]) {
		throw new EngineException("Function room_set_height is not implemented");
		// return 0;
	}

	static room_set_caption([_]) {
		throw new EngineException("Function room_set_caption is not implemented");
		// return 0;
	}

	static room_set_persistent([_]) {
		throw new EngineException("Function room_set_persistent is not implemented");
		// return 0;
	}

	static room_set_code([_]) {
		throw new EngineException("Function room_set_code is not implemented");
		// return 0;
	}

	static room_set_background_color([_]) {
		throw new EngineException("Function room_set_background_color is not implemented");
		// return 0;
	}

	static room_set_background([_]) {
		throw new EngineException("Function room_set_background is not implemented");
		// return 0;
	}

	static room_set_view([_]) {
		throw new EngineException("Function room_set_view is not implemented");
		// return 0;
	}

	static room_set_view_enabled([_]) {
		throw new EngineException("Function room_set_view_enabled is not implemented");
		// return 0;
	}

	static room_add([_]) {
		throw new EngineException("Function room_add is not implemented");
		// return 0;
	}

	static room_duplicate([_]) {
		throw new EngineException("Function room_duplicate is not implemented");
		// return 0;
	}

	static room_assign([_]) {
		throw new EngineException("Function room_assign is not implemented");
		// return 0;
	}

	static room_instance_add([_]) {
		throw new EngineException("Function room_instance_add is not implemented");
		// return 0;
	}

	static room_instance_clear([_]) {
		throw new EngineException("Function room_instance_clear is not implemented");
		// return 0;
	}

	static room_tile_add([_]) {
		throw new EngineException("Function room_tile_add is not implemented");
		// return 0;
	}

	static room_tile_add_ext([_]) {
		throw new EngineException("Function room_tile_add_ext is not implemented");
		// return 0;
	}

	static room_tile_clear([_]) {
		throw new EngineException("Function room_tile_clear is not implemented");
		// return 0;
	}

	// # Files, registry, and executing programs

	// ## Files

	static file_text_open_read([_]) {
		throw new EngineException("Function file_text_open_read is not implemented");
		// return 0;
	}

	static file_text_open_write([_]) {
		throw new EngineException("Function file_text_open_write is not implemented");
		// return 0;
	}

	static file_text_open_append([_]) {
		throw new EngineException("Function file_text_open_append is not implemented");
		// return 0;
	}

	static file_text_close([_]) {
		throw new EngineException("Function file_text_close is not implemented");
		// return 0;
	}

	static file_text_write_string([_]) {
		throw new EngineException("Function file_text_write_string is not implemented");
		// return 0;
	}

	static file_text_write_real([_]) {
		throw new EngineException("Function file_text_write_real is not implemented");
		// return 0;
	}

	static file_text_writeln([_]) {
		throw new EngineException("Function file_text_writeln is not implemented");
		// return 0;
	}

	static file_text_read_string([_]) {
		throw new EngineException("Function file_text_read_string is not implemented");
		// return 0;
	}

	static file_text_read_real([_]) {
		throw new EngineException("Function file_text_read_real is not implemented");
		// return 0;
	}

	static file_text_readln([_]) {
		throw new EngineException("Function file_text_readln is not implemented");
		// return 0;
	}

	static file_text_eof([_]) {
		throw new EngineException("Function file_text_eof is not implemented");
		// return 0;
	}

	static file_text_eoln([_]) {
		throw new EngineException("Function file_text_eoln is not implemented");
		// return 0;
	}

	static file_exists([_]) {
		throw new EngineException("Function file_exists is not implemented");
		// return 0;
	}

	static file_delete([_]) {
		throw new EngineException("Function file_delete is not implemented");
		// return 0;
	}

	static file_rename([_]) {
		throw new EngineException("Function file_rename is not implemented");
		// return 0;
	}

	static file_copy([_]) {
		throw new EngineException("Function file_copy is not implemented");
		// return 0;
	}

	static directory_create([_]) {
		throw new EngineException("Function directory_create is not implemented");
		// return 0;
	}

	static directory_exists([_]) {
		throw new EngineException("Function directory_exists is not implemented");
		// return 0;
	}

	static file_find_first([_]) {
		throw new EngineException("Function file_find_first is not implemented");
		// return 0;
	}

	static file_find_next([_]) {
		throw new EngineException("Function file_find_next is not implemented");
		// return 0;
	}

	static file_find_close([_]) {
		throw new EngineException("Function file_find_close is not implemented");
		// return 0;
	}

	static file_attributes([_]) {
		throw new EngineException("Function file_attributes is not implemented");
		// return 0;
	}

	static filename_name([_]) {
		throw new EngineException("Function filename_name is not implemented");
		// return 0;
	}

	static filename_path([_]) {
		throw new EngineException("Function filename_path is not implemented");
		// return 0;
	}

	static filename_dir([_]) {
		throw new EngineException("Function filename_dir is not implemented");
		// return 0;
	}

	static filename_drive([_]) {
		throw new EngineException("Function filename_drive is not implemented");
		// return 0;
	}

	static filename_ext([_]) {
		throw new EngineException("Function filename_ext is not implemented");
		// return 0;
	}

	static filename_change_ext([_]) {
		throw new EngineException("Function filename_change_ext is not implemented");
		// return 0;
	}

	static file_bin_open([_]) {
		throw new EngineException("Function file_bin_open is not implemented");
		// return 0;
	}

	static file_bin_rewrite([_]) {
		throw new EngineException("Function file_bin_rewrite is not implemented");
		// return 0;
	}

	static file_bin_close([_]) {
		throw new EngineException("Function file_bin_close is not implemented");
		// return 0;
	}

	static file_bin_size([_]) {
		throw new EngineException("Function file_bin_size is not implemented");
		// return 0;
	}

	static file_bin_position([_]) {
		throw new EngineException("Function file_bin_position is not implemented");
		// return 0;
	}

	static file_bin_seek([_]) {
		throw new EngineException("Function file_bin_seek is not implemented");
		// return 0;
	}

	static file_bin_write_byte([_]) {
		throw new EngineException("Function file_bin_write_byte is not implemented");
		// return 0;
	}

	static file_bin_read_byte([_]) {
		throw new EngineException("Function file_bin_read_byte is not implemented");
		// return 0;
	}

	static export_include_file([_]) {
		throw new EngineException("Function export_include_file is not implemented");
		// return 0;
	}

	static export_include_file_location([_]) {
		throw new EngineException("Function export_include_file_location is not implemented");
		// return 0;
	}

	static discard_include_file([_]) {
		throw new EngineException("Function discard_include_file is not implemented");
		// return 0;
	}

	static parameter_count([_]) {
		throw new EngineException("Function parameter_count is not implemented");
		// return 0;
	}

	static parameter_string([_]) {
		throw new EngineException("Function parameter_string is not implemented");
		// return 0;
	}

	static environment_get_variable([_]) {
		throw new EngineException("Function environment_get_variable is not implemented");
		// return 0;
	}

	static disk_size([_]) {
		throw new EngineException("Function disk_size is not implemented");
		// return 0;
	}

	static disk_free([_]) {
		throw new EngineException("Function disk_free is not implemented");
		// return 0;
	}

	// ## Registry

	static registry_write_string([_]) {
		throw new EngineException("Function registry_write_string is not implemented");
		// return 0;
	}

	static registry_write_real([_]) {
		throw new EngineException("Function registry_write_real is not implemented");
		// return 0;
	}

	static registry_read_string([_]) {
		throw new EngineException("Function registry_read_string is not implemented");
		// return 0;
	}

	static registry_read_real([_]) {
		throw new EngineException("Function registry_read_real is not implemented");
		// return 0;
	}

	static registry_exists([_]) {
		throw new EngineException("Function registry_exists is not implemented");
		// return 0;
	}

	static registry_write_string_ext([_]) {
		throw new EngineException("Function registry_write_string_ext is not implemented");
		// return 0;
	}

	static registry_write_real_ext([_]) {
		throw new EngineException("Function registry_write_real_ext is not implemented");
		// return 0;
	}

	static registry_read_string_ext([_]) {
		throw new EngineException("Function registry_read_string_ext is not implemented");
		// return 0;
	}

	static registry_read_real_ext([_]) {
		throw new EngineException("Function registry_read_real_ext is not implemented");
		// return 0;
	}

	static registry_exists_ext([_]) {
		throw new EngineException("Function registry_exists_ext is not implemented");
		// return 0;
	}

	static registry_set_root([_]) {
		throw new EngineException("Function registry_set_root is not implemented");
		// return 0;
	}

	// ## INI files

	static ini_open([_]) {
		throw new EngineException("Function ini_open is not implemented");
		// return 0;
	}

	static ini_close([_]) {
		throw new EngineException("Function ini_close is not implemented");
		// return 0;
	}

	static ini_read_string([_]) {
		throw new EngineException("Function ini_read_string is not implemented");
		// return 0;
	}

	static ini_read_real([_]) {
		throw new EngineException("Function ini_read_real is not implemented");
		// return 0;
	}

	static ini_write_string([_]) {
		throw new EngineException("Function ini_write_string is not implemented");
		// return 0;
	}

	static ini_write_real([_]) {
		throw new EngineException("Function ini_write_real is not implemented");
		// return 0;
	}

	static ini_key_exists([_]) {
		throw new EngineException("Function ini_key_exists is not implemented");
		// return 0;
	}

	static ini_section_exists([_]) {
		throw new EngineException("Function ini_section_exists is not implemented");
		// return 0;
	}

	static ini_key_delete([_]) {
		throw new EngineException("Function ini_key_delete is not implemented");
		// return 0;
	}

	static ini_section_delete([_]) {
		throw new EngineException("Function ini_section_delete is not implemented");
		// return 0;
	}

	// ## Executing programs

	static execute_program([_]) {
		throw new EngineException("Function execute_program is not implemented");
		// return 0;
	}

	static execute_shell([_]) {
		throw new EngineException("Function execute_shell is not implemented");
		// return 0;
	}

	// # Data structures

	static ds_set_precision([_]) {
		throw new EngineException("Function ds_set_precision is not implemented");
		// return 0;
	}

	// ## Stacks

	static ds_stack_create([_]) {
		throw new EngineException("Function ds_stack_create is not implemented");
		// return 0;
	}

	static ds_stack_destroy([_]) {
		throw new EngineException("Function ds_stack_destroy is not implemented");
		// return 0;
	}

	static ds_stack_clear([_]) {
		throw new EngineException("Function ds_stack_clear is not implemented");
		// return 0;
	}

	static ds_stack_copy([_]) {
		throw new EngineException("Function ds_stack_copy is not implemented");
		// return 0;
	}

	static ds_stack_size([_]) {
		throw new EngineException("Function ds_stack_size is not implemented");
		// return 0;
	}

	static ds_stack_empty([_]) {
		throw new EngineException("Function ds_stack_empty is not implemented");
		// return 0;
	}

	static ds_stack_push([_]) {
		throw new EngineException("Function ds_stack_push is not implemented");
		// return 0;
	}

	static ds_stack_pop([_]) {
		throw new EngineException("Function ds_stack_pop is not implemented");
		// return 0;
	}

	static ds_stack_top([_]) {
		throw new EngineException("Function ds_stack_top is not implemented");
		// return 0;
	}

	static ds_stack_write([_]) {
		throw new EngineException("Function ds_stack_write is not implemented");
		// return 0;
	}

	static ds_stack_read([_]) {
		throw new EngineException("Function ds_stack_read is not implemented");
		// return 0;
	}

	// ## Queues

	static ds_queue_create([_]) {
		throw new EngineException("Function ds_queue_create is not implemented");
		// return 0;
	}

	static ds_queue_destroy([_]) {
		throw new EngineException("Function ds_queue_destroy is not implemented");
		// return 0;
	}

	static ds_queue_clear([_]) {
		throw new EngineException("Function ds_queue_clear is not implemented");
		// return 0;
	}

	static ds_queue_copy([_]) {
		throw new EngineException("Function ds_queue_copy is not implemented");
		// return 0;
	}

	static ds_queue_size([_]) {
		throw new EngineException("Function ds_queue_size is not implemented");
		// return 0;
	}

	static ds_queue_empty([_]) {
		throw new EngineException("Function ds_queue_empty is not implemented");
		// return 0;
	}

	static ds_queue_enqueue([_]) {
		throw new EngineException("Function ds_queue_enqueue is not implemented");
		// return 0;
	}

	static ds_queue_dequeue([_]) {
		throw new EngineException("Function ds_queue_dequeue is not implemented");
		// return 0;
	}

	static ds_queue_head([_]) {
		throw new EngineException("Function ds_queue_head is not implemented");
		// return 0;
	}

	static ds_queue_tail([_]) {
		throw new EngineException("Function ds_queue_tail is not implemented");
		// return 0;
	}

	static ds_queue_write([_]) {
		throw new EngineException("Function ds_queue_write is not implemented");
		// return 0;
	}

	static ds_queue_read([_]) {
		throw new EngineException("Function ds_queue_read is not implemented");
		// return 0;
	}

	// ## Lists

	static ds_list_create([_]) {
		throw new EngineException("Function ds_list_create is not implemented");
		// return 0;
	}

	static ds_list_destroy([_]) {
		throw new EngineException("Function ds_list_destroy is not implemented");
		// return 0;
	}

	static ds_list_clear([_]) {
		throw new EngineException("Function ds_list_clear is not implemented");
		// return 0;
	}

	static ds_list_copy([_]) {
		throw new EngineException("Function ds_list_copy is not implemented");
		// return 0;
	}

	static ds_list_size([_]) {
		throw new EngineException("Function ds_list_size is not implemented");
		// return 0;
	}

	static ds_list_empty([_]) {
		throw new EngineException("Function ds_list_empty is not implemented");
		// return 0;
	}

	static ds_list_add([_]) {
		throw new EngineException("Function ds_list_add is not implemented");
		// return 0;
	}

	static ds_list_insert([_]) {
		throw new EngineException("Function ds_list_insert is not implemented");
		// return 0;
	}

	static ds_list_replace([_]) {
		throw new EngineException("Function ds_list_replace is not implemented");
		// return 0;
	}

	static ds_list_delete([_]) {
		throw new EngineException("Function ds_list_delete is not implemented");
		// return 0;
	}

	static ds_list_find_index([_]) {
		throw new EngineException("Function ds_list_find_index is not implemented");
		// return 0;
	}

	static ds_list_find_value([_]) {
		throw new EngineException("Function ds_list_find_value is not implemented");
		// return 0;
	}

	static ds_list_sort([_]) {
		throw new EngineException("Function ds_list_sort is not implemented");
		// return 0;
	}

	static ds_list_shuffle([_]) {
		throw new EngineException("Function ds_list_shuffle is not implemented");
		// return 0;
	}

	static ds_list_write([_]) {
		throw new EngineException("Function ds_list_write is not implemented");
		// return 0;
	}

	static ds_list_read([_]) {
		throw new EngineException("Function ds_list_read is not implemented");
		// return 0;
	}

	// ## Maps

	static ds_map_create([_]) {
		throw new EngineException("Function ds_map_create is not implemented");
		// return 0;
	}

	static ds_map_destroy([_]) {
		throw new EngineException("Function ds_map_destroy is not implemented");
		// return 0;
	}

	static ds_map_clear([_]) {
		throw new EngineException("Function ds_map_clear is not implemented");
		// return 0;
	}

	static ds_map_copy([_]) {
		throw new EngineException("Function ds_map_copy is not implemented");
		// return 0;
	}

	static ds_map_size([_]) {
		throw new EngineException("Function ds_map_size is not implemented");
		// return 0;
	}

	static ds_map_empty([_]) {
		throw new EngineException("Function ds_map_empty is not implemented");
		// return 0;
	}

	static ds_map_add([_]) {
		throw new EngineException("Function ds_map_add is not implemented");
		// return 0;
	}

	static ds_map_replace([_]) {
		throw new EngineException("Function ds_map_replace is not implemented");
		// return 0;
	}

	static ds_map_delete([_]) {
		throw new EngineException("Function ds_map_delete is not implemented");
		// return 0;
	}

	static ds_map_exists([_]) {
		throw new EngineException("Function ds_map_exists is not implemented");
		// return 0;
	}

	static ds_map_find_value([_]) {
		throw new EngineException("Function ds_map_find_value is not implemented");
		// return 0;
	}

	static ds_map_find_previous([_]) {
		throw new EngineException("Function ds_map_find_previous is not implemented");
		// return 0;
	}

	static ds_map_find_next([_]) {
		throw new EngineException("Function ds_map_find_next is not implemented");
		// return 0;
	}

	static ds_map_find_first([_]) {
		throw new EngineException("Function ds_map_find_first is not implemented");
		// return 0;
	}

	static ds_map_find_last([_]) {
		throw new EngineException("Function ds_map_find_last is not implemented");
		// return 0;
	}

	static ds_map_write([_]) {
		throw new EngineException("Function ds_map_write is not implemented");
		// return 0;
	}

	static ds_map_read([_]) {
		throw new EngineException("Function ds_map_read is not implemented");
		// return 0;
	}

	// ## Priority queues

	static ds_priority_create([_]) {
		throw new EngineException("Function ds_priority_create is not implemented");
		// return 0;
	}

	static ds_priority_destroy([_]) {
		throw new EngineException("Function ds_priority_destroy is not implemented");
		// return 0;
	}

	static ds_priority_clear([_]) {
		throw new EngineException("Function ds_priority_clear is not implemented");
		// return 0;
	}

	static ds_priority_copy([_]) {
		throw new EngineException("Function ds_priority_copy is not implemented");
		// return 0;
	}

	static ds_priority_size([_]) {
		throw new EngineException("Function ds_priority_size is not implemented");
		// return 0;
	}

	static ds_priority_empty([_]) {
		throw new EngineException("Function ds_priority_empty is not implemented");
		// return 0;
	}

	static ds_priority_add([_]) {
		throw new EngineException("Function ds_priority_add is not implemented");
		// return 0;
	}

	static ds_priority_change_priority([_]) {
		throw new EngineException("Function ds_priority_change_priority is not implemented");
		// return 0;
	}

	static ds_priority_find_priority([_]) {
		throw new EngineException("Function ds_priority_find_priority is not implemented");
		// return 0;
	}

	static ds_priority_delete_value([_]) {
		throw new EngineException("Function ds_priority_delete_value is not implemented");
		// return 0;
	}

	static ds_priority_delete_min([_]) {
		throw new EngineException("Function ds_priority_delete_min is not implemented");
		// return 0;
	}

	static ds_priority_find_min([_]) {
		throw new EngineException("Function ds_priority_find_min is not implemented");
		// return 0;
	}

	static ds_priority_delete_max([_]) {
		throw new EngineException("Function ds_priority_delete_max is not implemented");
		// return 0;
	}

	static ds_priority_find_max([_]) {
		throw new EngineException("Function ds_priority_find_max is not implemented");
		// return 0;
	}

	static ds_priority_write([_]) {
		throw new EngineException("Function ds_priority_write is not implemented");
		// return 0;
	}

	static ds_priority_read([_]) {
		throw new EngineException("Function ds_priority_read is not implemented");
		// return 0;
	}

	// ## Grids

	static ds_grid_create([_]) {
		throw new EngineException("Function ds_grid_create is not implemented");
		// return 0;
	}

	static ds_grid_destroy([_]) {
		throw new EngineException("Function ds_grid_destroy is not implemented");
		// return 0;
	}

	static ds_grid_copy([_]) {
		throw new EngineException("Function ds_grid_copy is not implemented");
		// return 0;
	}

	static ds_grid_resize([_]) {
		throw new EngineException("Function ds_grid_resize is not implemented");
		// return 0;
	}

	static ds_grid_width([_]) {
		throw new EngineException("Function ds_grid_width is not implemented");
		// return 0;
	}

	static ds_grid_height([_]) {
		throw new EngineException("Function ds_grid_height is not implemented");
		// return 0;
	}

	static ds_grid_clear([_]) {
		throw new EngineException("Function ds_grid_clear is not implemented");
		// return 0;
	}

	static ds_grid_set([_]) {
		throw new EngineException("Function ds_grid_set is not implemented");
		// return 0;
	}

	static ds_grid_add([_]) {
		throw new EngineException("Function ds_grid_add is not implemented");
		// return 0;
	}

	static ds_grid_multiply([_]) {
		throw new EngineException("Function ds_grid_multiply is not implemented");
		// return 0;
	}

	static ds_grid_set_region([_]) {
		throw new EngineException("Function ds_grid_set_region is not implemented");
		// return 0;
	}

	static ds_grid_add_region([_]) {
		throw new EngineException("Function ds_grid_add_region is not implemented");
		// return 0;
	}

	static ds_grid_multiply_region([_]) {
		throw new EngineException("Function ds_grid_multiply_region is not implemented");
		// return 0;
	}

	static ds_grid_set_disk([_]) {
		throw new EngineException("Function ds_grid_set_disk is not implemented");
		// return 0;
	}

	static ds_grid_add_disk([_]) {
		throw new EngineException("Function ds_grid_add_disk is not implemented");
		// return 0;
	}

	static ds_grid_multiply_disk([_]) {
		throw new EngineException("Function ds_grid_multiply_disk is not implemented");
		// return 0;
	}

	static ds_grid_set_grid_region([_]) {
		throw new EngineException("Function ds_grid_set_grid_region is not implemented");
		// return 0;
	}

	static ds_grid_add_grid_region([_]) {
		throw new EngineException("Function ds_grid_add_grid_region is not implemented");
		// return 0;
	}

	static ds_grid_multiply_grid_region([_]) {
		throw new EngineException("Function ds_grid_multiply_grid_region is not implemented");
		// return 0;
	}

	static ds_grid_get([_]) {
		throw new EngineException("Function ds_grid_get is not implemented");
		// return 0;
	}

	static ds_grid_get_sum([_]) {
		throw new EngineException("Function ds_grid_get_sum is not implemented");
		// return 0;
	}

	static ds_grid_get_max([_]) {
		throw new EngineException("Function ds_grid_get_max is not implemented");
		// return 0;
	}

	static ds_grid_get_min([_]) {
		throw new EngineException("Function ds_grid_get_min is not implemented");
		// return 0;
	}

	static ds_grid_get_mean([_]) {
		throw new EngineException("Function ds_grid_get_mean is not implemented");
		// return 0;
	}

	static ds_grid_get_disk_sum([_]) {
		throw new EngineException("Function ds_grid_get_disk_sum is not implemented");
		// return 0;
	}

	static ds_grid_get_disk_min([_]) {
		throw new EngineException("Function ds_grid_get_disk_min is not implemented");
		// return 0;
	}

	static ds_grid_get_disk_max([_]) {
		throw new EngineException("Function ds_grid_get_disk_max is not implemented");
		// return 0;
	}

	static ds_grid_get_disk_mean([_]) {
		throw new EngineException("Function ds_grid_get_disk_mean is not implemented");
		// return 0;
	}

	static ds_grid_value_exists([_]) {
		throw new EngineException("Function ds_grid_value_exists is not implemented");
		// return 0;
	}

	static ds_grid_value_x([_]) {
		throw new EngineException("Function ds_grid_value_x is not implemented");
		// return 0;
	}

	static ds_grid_value_y([_]) {
		throw new EngineException("Function ds_grid_value_y is not implemented");
		// return 0;
	}

	static ds_grid_value_disk_exists([_]) {
		throw new EngineException("Function ds_grid_value_disk_exists is not implemented");
		// return 0;
	}

	static ds_grid_value_disk_x([_]) {
		throw new EngineException("Function ds_grid_value_disk_x is not implemented");
		// return 0;
	}

	static ds_grid_value_disk_y([_]) {
		throw new EngineException("Function ds_grid_value_disk_y is not implemented");
		// return 0;
	}

	static ds_grid_shuffle([_]) {
		throw new EngineException("Function ds_grid_shuffle is not implemented");
		// return 0;
	}

	static ds_grid_write([_]) {
		throw new EngineException("Function ds_grid_write is not implemented");
		// return 0;
	}

	static ds_grid_read([_]) {
		throw new EngineException("Function ds_grid_read is not implemented");
		// return 0;
	}

	// # Creating particles

	// ## Simple effects

	static effect_create_below([_]) {
		throw new EngineException("Function effect_create_below is not implemented");
		// return 0;
	}

	static effect_create_above([_]) {
		throw new EngineException("Function effect_create_above is not implemented");
		// return 0;
	}

	static effect_clear([_]) {
		throw new EngineException("Function effect_clear is not implemented");
		// return 0;
	}

	// ## Particle types

	static part_type_create([_]) {
		throw new EngineException("Function part_type_create is not implemented");
		// return 0;
	}

	static part_type_destroy([_]) {
		throw new EngineException("Function part_type_destroy is not implemented");
		// return 0;
	}

	static part_type_exists([_]) {
		throw new EngineException("Function part_type_exists is not implemented");
		// return 0;
	}

	static part_type_clear([_]) {
		throw new EngineException("Function part_type_clear is not implemented");
		// return 0;
	}

	static part_type_shape([_]) {
		throw new EngineException("Function part_type_shape is not implemented");
		// return 0;
	}

	static part_type_sprite([_]) {
		throw new EngineException("Function part_type_sprite is not implemented");
		// return 0;
	}

	static part_type_size([_]) {
		throw new EngineException("Function part_type_size is not implemented");
		// return 0;
	}

	static part_type_scale([_]) {
		throw new EngineException("Function part_type_scale is not implemented");
		// return 0;
	}

	static part_type_orientation([_]) {
		throw new EngineException("Function part_type_orientation is not implemented");
		// return 0;
	}

	static part_type_color1([_]) {
		throw new EngineException("Function part_type_color1 is not implemented");
		// return 0;
	}

	static part_type_color2([_]) {
		throw new EngineException("Function part_type_color2 is not implemented");
		// return 0;
	}

	static part_type_color3([_]) {
		throw new EngineException("Function part_type_color3 is not implemented");
		// return 0;
	}

	static part_type_color_mix([_]) {
		throw new EngineException("Function part_type_color_mix is not implemented");
		// return 0;
	}

	static part_type_color_rgb([_]) {
		throw new EngineException("Function part_type_color_rgb is not implemented");
		// return 0;
	}

	static part_type_color_hsv([_]) {
		throw new EngineException("Function part_type_color_hsv is not implemented");
		// return 0;
	}

	static part_type_alpha1([_]) {
		throw new EngineException("Function part_type_alpha1 is not implemented");
		// return 0;
	}

	static part_type_alpha2([_]) {
		throw new EngineException("Function part_type_alpha2 is not implemented");
		// return 0;
	}

	static part_type_alpha3([_]) {
		throw new EngineException("Function part_type_alpha3 is not implemented");
		// return 0;
	}

	static part_type_blend([_]) {
		throw new EngineException("Function part_type_blend is not implemented");
		// return 0;
	}

	static part_type_life([_]) {
		throw new EngineException("Function part_type_life is not implemented");
		// return 0;
	}

	static part_type_step([_]) {
		throw new EngineException("Function part_type_step is not implemented");
		// return 0;
	}

	static part_type_death([_]) {
		throw new EngineException("Function part_type_death is not implemented");
		// return 0;
	}

	static part_type_speed([_]) {
		throw new EngineException("Function part_type_speed is not implemented");
		// return 0;
	}

	static part_type_direction([_]) {
		throw new EngineException("Function part_type_direction is not implemented");
		// return 0;
	}

	static part_type_gravity([_]) {
		throw new EngineException("Function part_type_gravity is not implemented");
		// return 0;
	}

	// ## Particle systems

	static part_system_create([_]) {
		throw new EngineException("Function part_system_create is not implemented");
		// return 0;
	}

	static part_system_destroy([_]) {
		throw new EngineException("Function part_system_destroy is not implemented");
		// return 0;
	}

	static part_system_exists([_]) {
		throw new EngineException("Function part_system_exists is not implemented");
		// return 0;
	}

	static part_system_clear([_]) {
		throw new EngineException("Function part_system_clear is not implemented");
		// return 0;
	}

	static part_system_draw_order([_]) {
		throw new EngineException("Function part_system_draw_order is not implemented");
		// return 0;
	}

	static part_system_depth([_]) {
		throw new EngineException("Function part_system_depth is not implemented");
		// return 0;
	}

	static part_system_position([_]) {
		throw new EngineException("Function part_system_position is not implemented");
		// return 0;
	}

	static part_system_automatic_update([_]) {
		throw new EngineException("Function part_system_automatic_update is not implemented");
		// return 0;
	}

	static part_system_automatic_draw([_]) {
		throw new EngineException("Function part_system_automatic_draw is not implemented");
		// return 0;
	}

	static part_system_update([_]) {
		throw new EngineException("Function part_system_update is not implemented");
		// return 0;
	}

	static part_system_drawit([_]) {
		throw new EngineException("Function part_system_drawit is not implemented");
		// return 0;
	}

	static part_particles_create([_]) {
		throw new EngineException("Function part_particles_create is not implemented");
		// return 0;
	}

	static part_particles_create_color([_]) {
		throw new EngineException("Function part_particles_create_color is not implemented");
		// return 0;
	}

	static part_particles_clear([_]) {
		throw new EngineException("Function part_particles_clear is not implemented");
		// return 0;
	}

	static part_particles_count([_]) {
		throw new EngineException("Function part_particles_count is not implemented");
		// return 0;
	}

	// ## Emitters

	static part_emitter_create([_]) {
		throw new EngineException("Function part_emitter_create is not implemented");
		// return 0;
	}

	static part_emitter_destroy([_]) {
		throw new EngineException("Function part_emitter_destroy is not implemented");
		// return 0;
	}

	static part_emitter_destroy_all([_]) {
		throw new EngineException("Function part_emitter_destroy_all is not implemented");
		// return 0;
	}

	static part_emitter_exists([_]) {
		throw new EngineException("Function part_emitter_exists is not implemented");
		// return 0;
	}

	static part_emitter_clear([_]) {
		throw new EngineException("Function part_emitter_clear is not implemented");
		// return 0;
	}

	static part_emitter_region([_]) {
		throw new EngineException("Function part_emitter_region is not implemented");
		// return 0;
	}

	static part_emitter_burst([_]) {
		throw new EngineException("Function part_emitter_burst is not implemented");
		// return 0;
	}

	static part_emitter_stream([_]) {
		throw new EngineException("Function part_emitter_stream is not implemented");
		// return 0;
	}

	// ## Attractors

	static part_attractor_create([_]) {
		throw new EngineException("Function part_attractor_create is not implemented");
		// return 0;
	}

	static part_attractor_destroy([_]) {
		throw new EngineException("Function part_attractor_destroy is not implemented");
		// return 0;
	}

	static part_attractor_destroy_all([_]) {
		throw new EngineException("Function part_attractor_destroy_all is not implemented");
		// return 0;
	}

	static part_attractor_exists([_]) {
		throw new EngineException("Function part_attractor_exists is not implemented");
		// return 0;
	}

	static part_attractor_clear([_]) {
		throw new EngineException("Function part_attractor_clear is not implemented");
		// return 0;
	}

	static part_attractor_position([_]) {
		throw new EngineException("Function part_attractor_position is not implemented");
		// return 0;
	}

	static part_attractor_force([_]) {
		throw new EngineException("Function part_attractor_force is not implemented");
		// return 0;
	}

	// ## Destroyers

	static part_destroyer_create([_]) {
		throw new EngineException("Function part_destroyer_create is not implemented");
		// return 0;
	}

	static part_destroyer_destroy([_]) {
		throw new EngineException("Function part_destroyer_destroy is not implemented");
		// return 0;
	}

	static part_destroyer_destroy_all([_]) {
		throw new EngineException("Function part_destroyer_destroy_all is not implemented");
		// return 0;
	}

	static part_destroyer_exists([_]) {
		throw new EngineException("Function part_destroyer_exists is not implemented");
		// return 0;
	}

	static part_destroyer_clear([_]) {
		throw new EngineException("Function part_destroyer_clear is not implemented");
		// return 0;
	}

	static part_destroyer_region([_]) {
		throw new EngineException("Function part_destroyer_region is not implemented");
		// return 0;
	}

	// ## Deflectors

	static part_deflector_create([_]) {
		throw new EngineException("Function part_deflector_create is not implemented");
		// return 0;
	}

	static part_deflector_destroy([_]) {
		throw new EngineException("Function part_deflector_destroy is not implemented");
		// return 0;
	}

	static part_deflector_destroy_all([_]) {
		throw new EngineException("Function part_deflector_destroy_all is not implemented");
		// return 0;
	}

	static part_deflector_exists([_]) {
		throw new EngineException("Function part_deflector_exists is not implemented");
		// return 0;
	}

	static part_deflector_clear([_]) {
		throw new EngineException("Function part_deflector_clear is not implemented");
		// return 0;
	}

	static part_deflector_region([_]) {
		throw new EngineException("Function part_deflector_region is not implemented");
		// return 0;
	}

	static part_deflector_kind([_]) {
		throw new EngineException("Function part_deflector_kind is not implemented");
		// return 0;
	}

	static part_deflector_friction([_]) {
		throw new EngineException("Function part_deflector_friction is not implemented");
		// return 0;
	}

	// ## Changers

	static part_changer_create([_]) {
		throw new EngineException("Function part_changer_create is not implemented");
		// return 0;
	}

	static part_changer_destroy([_]) {
		throw new EngineException("Function part_changer_destroy is not implemented");
		// return 0;
	}

	static part_changer_destroy_all([_]) {
		throw new EngineException("Function part_changer_destroy_all is not implemented");
		// return 0;
	}

	static part_changer_exists([_]) {
		throw new EngineException("Function part_changer_exists is not implemented");
		// return 0;
	}

	static part_changer_clear([_]) {
		throw new EngineException("Function part_changer_clear is not implemented");
		// return 0;
	}

	static part_changer_region([_]) {
		throw new EngineException("Function part_changer_region is not implemented");
		// return 0;
	}

	static part_changer_types([_]) {
		throw new EngineException("Function part_changer_types is not implemented");
		// return 0;
	}

	static part_changer_kind([_]) {
		throw new EngineException("Function part_changer_kind is not implemented");
		// return 0;
	}

	// ## Firework example  // no functions

	// # Multiplayer games

	// ## Setting up a connection

	static mplay_init_ipx([_]) {
		throw new EngineException("Function mplay_init_ipx is not implemented");
		// return 0;
	}

	static mplay_init_tcpip([_]) {
		throw new EngineException("Function mplay_init_tcpip is not implemented");
		// return 0;
	}

	static mplay_init_modem([_]) {
		throw new EngineException("Function mplay_init_modem is not implemented");
		// return 0;
	}

	static mplay_init_serial([_]) {
		throw new EngineException("Function mplay_init_serial is not implemented");
		// return 0;
	}

	static mplay_connect_status([_]) {
		throw new EngineException("Function mplay_connect_status is not implemented");
		// return 0;
	}

	static mplay_end([_]) {
		throw new EngineException("Function mplay_end is not implemented");
		// return 0;
	}

	static mplay_ipaddress([_]) {
		throw new EngineException("Function mplay_ipaddress is not implemented");
		// return 0;
	}

	// ## Creating and joining sessions

	static mplay_session_create([_]) {
		throw new EngineException("Function mplay_session_create is not implemented");
		// return 0;
	}

	static mplay_session_find([_]) {
		throw new EngineException("Function mplay_session_find is not implemented");
		// return 0;
	}

	static mplay_session_name([_]) {
		throw new EngineException("Function mplay_session_name is not implemented");
		// return 0;
	}

	static mplay_session_join([_]) {
		throw new EngineException("Function mplay_session_join is not implemented");
		// return 0;
	}

	static mplay_session_mode([_]) {
		throw new EngineException("Function mplay_session_mode is not implemented");
		// return 0;
	}

	static mplay_session_status([_]) {
		throw new EngineException("Function mplay_session_status is not implemented");
		// return 0;
	}

	static mplay_session_end([_]) {
		throw new EngineException("Function mplay_session_end is not implemented");
		// return 0;
	}

	// ## Players

	static mplay_player_find([_]) {
		throw new EngineException("Function mplay_player_find is not implemented");
		// return 0;
	}

	static mplay_player_name([_]) {
		throw new EngineException("Function mplay_player_name is not implemented");
		// return 0;
	}

	static mplay_player_id([_]) {
		throw new EngineException("Function mplay_player_id is not implemented");
		// return 0;
	}

	// ## Shared data

	static mplay_data_write([_]) {
		throw new EngineException("Function mplay_data_write is not implemented");
		// return 0;
	}

	static mplay_data_read([_]) {
		throw new EngineException("Function mplay_data_read is not implemented");
		// return 0;
	}

	static mplay_data_mode([_]) {
		throw new EngineException("Function mplay_data_mode is not implemented");
		// return 0;
	}

	// ## Messages

	static mplay_message_send([_]) {
		throw new EngineException("Function mplay_message_send is not implemented");
		// return 0;
	}

	static mplay_message_send_guaranteed([_]) {
		throw new EngineException("Function mplay_message_send_guaranteed is not implemented");
		// return 0;
	}

	static mplay_message_receive([_]) {
		throw new EngineException("Function mplay_message_receive is not implemented");
		// return 0;
	}

	static mplay_message_id([_]) {
		throw new EngineException("Function mplay_message_id is not implemented");
		// return 0;
	}

	static mplay_message_value([_]) {
		throw new EngineException("Function mplay_message_value is not implemented");
		// return 0;
	}

	static mplay_message_player([_]) {
		throw new EngineException("Function mplay_message_player is not implemented");
		// return 0;
	}

	static mplay_message_name([_]) {
		throw new EngineException("Function mplay_message_name is not implemented");
		// return 0;
	}

	static mplay_message_count([_]) {
		throw new EngineException("Function mplay_message_count is not implemented");
		// return 0;
	}

	static mplay_message_clear([_]) {
		throw new EngineException("Function mplay_message_clear is not implemented");
		// return 0;
	}

	// # Using DLL's

	static external_define([_]) {
		throw new EngineException("Function external_define is not implemented");
		// return 0;
	}

	static external_call([_]) {
		throw new EngineException("Function external_call is not implemented");
		// return 0;
	}

	static external_free([_]) {
		throw new EngineException("Function external_free is not implemented");
		// return 0;
	}

	// static execute_string ([str]) {} // repeated
	// static execute_file ([_]) {} // repeated

	static window_handle([_]) {
		throw new EngineException("Function window_handle is not implemented");
		// return 0;
	}

	// # 3D Graphics

	// ## Going to 3D mode

	static d3d_start([_]) {
		throw new EngineException("Function d3d_start is not implemented");
		// return 0;
	}

	static d3d_end([_]) {
		throw new EngineException("Function d3d_end is not implemented");
		// return 0;
	}

	static d3d_set_hidden([_]) {
		throw new EngineException("Function d3d_set_hidden is not implemented");
		// return 0;
	}

	static d3d_set_perspective([_]) {
		throw new EngineException("Function d3d_set_perspective is not implemented");
		// return 0;
	}

	// ## Easy drawing

	static d3d_set_depth([_]) {
		throw new EngineException("Function d3d_set_depth is not implemented");
		// return 0;
	}

	// ## Drawing polygons in 3D

	static d3d_primitive_begin([_]) {
		throw new EngineException("Function d3d_primitive_begin is not implemented");
		// return 0;
	}

	static d3d_vertex([_]) {
		throw new EngineException("Function d3d_vertex is not implemented");
		// return 0;
	}

	static d3d_vertex_color([_]) {
		throw new EngineException("Function d3d_vertex_color is not implemented");
		// return 0;
	}

	static d3d_primitive_end([_]) {
		throw new EngineException("Function d3d_primitive_end is not implemented");
		// return 0;
	}

	static d3d_primitive_begin_texture([_]) {
		throw new EngineException("Function d3d_primitive_begin_texture is not implemented");
		// return 0;
	}

	static d3d_vertex_texture([_]) {
		throw new EngineException("Function d3d_vertex_texture is not implemented");
		// return 0;
	}

	static d3d_vertex_texture_color([_]) {
		throw new EngineException("Function d3d_vertex_texture_color is not implemented");
		// return 0;
	}

	// static d3d_primitive_end ([_]) {} // repeated

	static d3d_set_culling([_]) {
		throw new EngineException("Function d3d_set_culling is not implemented");
		// return 0;
	}

	// ## Drawing basic shapes

	static d3d_draw_block([_]) {
		throw new EngineException("Function d3d_draw_block is not implemented");
		// return 0;
	}

	static d3d_draw_cylinder([_]) {
		throw new EngineException("Function d3d_draw_cylinder is not implemented");
		// return 0;
	}

	static d3d_draw_cone([_]) {
		throw new EngineException("Function d3d_draw_cone is not implemented");
		// return 0;
	}

	static d3d_draw_ellipsoid([_]) {
		throw new EngineException("Function d3d_draw_ellipsoid is not implemented");
		// return 0;
	}

	static d3d_draw_wall([_]) {
		throw new EngineException("Function d3d_draw_wall is not implemented");
		// return 0;
	}

	static d3d_draw_floor([_]) {
		throw new EngineException("Function d3d_draw_floor is not implemented");
		// return 0;
	}

	// ## Viewing the world

	static d3d_set_projection([_]) {
		throw new EngineException("Function d3d_set_projection is not implemented");
		// return 0;
	}

	static d3d_set_projection_ext([_]) {
		throw new EngineException("Function d3d_set_projection_ext is not implemented");
		// return 0;
	}

	static d3d_set_projection_ortho([_]) {
		throw new EngineException("Function d3d_set_projection_ortho is not implemented");
		// return 0;
	}

	static d3d_set_projection_perspective([_]) {
		throw new EngineException("Function d3d_set_projection_perspective is not implemented");
		// return 0;
	}

	// ## Transformations

	static d3d_transform_set_identity([_]) {
		throw new EngineException("Function d3d_transform_set_identity is not implemented");
		// return 0;
	}

	static d3d_transform_set_translation([_]) {
		throw new EngineException("Function d3d_transform_set_translation is not implemented");
		// return 0;
	}

	static d3d_transform_set_scaling([_]) {
		throw new EngineException("Function d3d_transform_set_scaling is not implemented");
		// return 0;
	}

	static d3d_transform_set_rotation_x([_]) {
		throw new EngineException("Function d3d_transform_set_rotation_x is not implemented");
		// return 0;
	}

	static d3d_transform_set_rotation_y([_]) {
		throw new EngineException("Function d3d_transform_set_rotation_y is not implemented");
		// return 0;
	}

	static d3d_transform_set_rotation_z([_]) {
		throw new EngineException("Function d3d_transform_set_rotation_z is not implemented");
		// return 0;
	}

	static d3d_transform_set_rotation_axis([_]) {
		throw new EngineException("Function d3d_transform_set_rotation_axis is not implemented");
		// return 0;
	}

	static d3d_transform_add_translation([_]) {
		throw new EngineException("Function d3d_transform_add_translation is not implemented");
		// return 0;
	}

	static d3d_transform_add_scaling([_]) {
		throw new EngineException("Function d3d_transform_add_scaling is not implemented");
		// return 0;
	}

	static d3d_transform_add_rotation_x([_]) {
		throw new EngineException("Function d3d_transform_add_rotation_x is not implemented");
		// return 0;
	}

	static d3d_transform_add_rotation_y([_]) {
		throw new EngineException("Function d3d_transform_add_rotation_y is not implemented");
		// return 0;
	}

	static d3d_transform_add_rotation_z([_]) {
		throw new EngineException("Function d3d_transform_add_rotation_z is not implemented");
		// return 0;
	}

	static d3d_transform_add_rotation_axis([_]) {
		throw new EngineException("Function d3d_transform_add_rotation_axis is not implemented");
		// return 0;
	}

	static d3d_transform_stack_clear([_]) {
		throw new EngineException("Function d3d_transform_stack_clear is not implemented");
		// return 0;
	}

	static d3d_transform_stack_empty([_]) {
		throw new EngineException("Function d3d_transform_stack_empty is not implemented");
		// return 0;
	}

	static d3d_transform_stack_push([_]) {
		throw new EngineException("Function d3d_transform_stack_push is not implemented");
		// return 0;
	}

	static d3d_transform_stack_pop([_]) {
		throw new EngineException("Function d3d_transform_stack_pop is not implemented");
		// return 0;
	}

	static d3d_transform_stack_top([_]) {
		throw new EngineException("Function d3d_transform_stack_top is not implemented");
		// return 0;
	}

	static d3d_transform_stack_discard([_]) {
		throw new EngineException("Function d3d_transform_stack_discard is not implemented");
		// return 0;
	}

	// ## Fog

	static d3d_set_fog([_]) {
		throw new EngineException("Function d3d_set_fog is not implemented");
		// return 0;
	}

	// ## Lighting

	static d3d_set_lighting([_]) {
		throw new EngineException("Function d3d_set_lighting is not implemented");
		// return 0;
	}

	static d3d_set_shading([_]) {
		throw new EngineException("Function d3d_set_shading is not implemented");
		// return 0;
	}

	static d3d_light_define_direction([_]) {
		throw new EngineException("Function d3d_light_define_direction is not implemented");
		// return 0;
	}

	static d3d_light_define_point([_]) {
		throw new EngineException("Function d3d_light_define_point is not implemented");
		// return 0;
	}

	static d3d_light_enable([_]) {
		throw new EngineException("Function d3d_light_enable is not implemented");
		// return 0;
	}

	static d3d_vertex_normal([_]) {
		throw new EngineException("Function d3d_vertex_normal is not implemented");
		// return 0;
	}

	static d3d_vertex_normal_color([_]) {
		throw new EngineException("Function d3d_vertex_normal_color is not implemented");
		// return 0;
	}

	static d3d_vertex_normal_texture([_]) {
		throw new EngineException("Function d3d_vertex_normal_texture is not implemented");
		// return 0;
	}

	static d3d_vertex_normal_texture_color([_]) {
		throw new EngineException("Function d3d_vertex_normal_texture_color is not implemented");
		// return 0;
	}

	// ## Creating models

	static d3d_model_create([_]) {
		throw new EngineException("Function d3d_model_create is not implemented");
		// return 0;
	}

	static d3d_model_destroy([_]) {
		throw new EngineException("Function d3d_model_destroy is not implemented");
		// return 0;
	}

	static d3d_model_clear([_]) {
		throw new EngineException("Function d3d_model_clear is not implemented");
		// return 0;
	}

	static d3d_model_save([_]) {
		throw new EngineException("Function d3d_model_save is not implemented");
		// return 0;
	}

	static d3d_model_load([_]) {
		throw new EngineException("Function d3d_model_load is not implemented");
		// return 0;
	}

	static d3d_model_draw([_]) {
		throw new EngineException("Function d3d_model_draw is not implemented");
		// return 0;
	}

	static d3d_model_primitive_begin([_]) {
		throw new EngineException("Function d3d_model_primitive_begin is not implemented");
		// return 0;
	}

	static d3d_model_vertex([_]) {
		throw new EngineException("Function d3d_model_vertex is not implemented");
		// return 0;
	}

	static d3d_model_vertex_color([_]) {
		throw new EngineException("Function d3d_model_vertex_color is not implemented");
		// return 0;
	}

	static d3d_model_vertex_texture([_]) {
		throw new EngineException("Function d3d_model_vertex_texture is not implemented");
		// return 0;
	}

	static d3d_model_vertex_texture_color([_]) {
		throw new EngineException("Function d3d_model_vertex_texture_color is not implemented");
		// return 0;
	}

	static d3d_model_vertex_normal([_]) {
		throw new EngineException("Function d3d_model_vertex_normal is not implemented");
		// return 0;
	}

	static d3d_model_vertex_normal_color([_]) {
		throw new EngineException("Function d3d_model_vertex_normal_color is not implemented");
		// return 0;
	}

	static d3d_model_vertex_normal_texture([_]) {
		throw new EngineException("Function d3d_model_vertex_normal_texture is not implemented");
		// return 0;
	}

	static d3d_model_vertex_normal_texture_color([_]) {
		throw new EngineException("Function d3d_model_vertex_normal_texture_color is not implemented");
		// return 0;
	}

	static d3d_model_primitive_end([_]) {
		throw new EngineException("Function d3d_model_primitive_end is not implemented");
		// return 0;
	}

	static d3d_model_block([_]) {
		throw new EngineException("Function d3d_model_block is not implemented");
		// return 0;
	}

	static d3d_model_cylinder([_]) {
		throw new EngineException("Function d3d_model_cylinder is not implemented");
		// return 0;
	}

	static d3d_model_cone([_]) {
		throw new EngineException("Function d3d_model_cone is not implemented");
		// return 0;
	}

	static d3d_model_ellipsoid([_]) {
		throw new EngineException("Function d3d_model_ellipsoid is not implemented");
		// return 0;
	}

	static d3d_model_wall([_]) {
		throw new EngineException("Function d3d_model_wall is not implemented");
		// return 0;
	}

	static d3d_model_floor([_]) {
		throw new EngineException("Function d3d_model_floor is not implemented");
		// return 0;
	}

	// ## Final words  // no functions

	// # Action functions

	// (arguments, relative)

	// ## move

	// ### Move

	static action_move([directions, speed], relative) {
		const values = parseArrowString(directions);

		const angles = [
			225, 270, 315,
			180, null, 0,
			135, 90, 45,
		];

		const possibleAngles = [];

		for (let i = 0; i < 9; ++i) {
			if (values[i]) {
				possibleAngles.push(angles[i]);
			}
		}

		const chosenAngle = possibleAngles[Math.floor( Math.random() * possibleAngles.length )];

		if (chosenAngle != null) {
			speed = (!relative ? speed : this.currentInstance.vars.getBuiltIn("speed") + speed);
			this.currentInstance.setDirectionAndSpeed(chosenAngle, speed);
		} else {
			this.currentInstance.vars.setBuiltIn("speed", 0);
		}

		return 0;
	}

	static action_set_motion([direction, speed], relative) {
		if (!relative) {
			BuiltInFunctions.motion_set.call(this, [direction, speed]);
		} else {
			BuiltInFunctions.motion_add.call(this, [direction, speed]);
		}
		return 0;
	}

	static action_move_point([x, y, speed], relative) {
		// If not relative: x - instance.x (you subtract to make instance the center)
		// If relative: x - instance.x + instance.x == x
		if (!relative) {
			x -= this.currentInstance.vars.getBuiltIn("x");
			y -= this.currentInstance.vars.getBuiltIn("y");
		}

		this.currentInstance.setDirectionAndSpeed(Math.atan2(-y, x) * (180 / Math.PI), speed);
		return 0;
	}

	static action_set_hspeed([horSpeed], relative) {
		horSpeed = (!relative ? horSpeed : this.currentInstance.vars.getBuiltIn("hspeed") + horSpeed);
		this.currentInstance.vars.setBuiltInCall("hspeed", horSpeed);
		return 0;
	}

	static action_set_vspeed([vertSpeed], relative) {
		vertSpeed = (!relative ? vertSpeed : this.currentInstance.vars.getBuiltIn("vspeed") + vertSpeed);
		this.currentInstance.vars.setBuiltInCall("vspeed", vertSpeed);
		return 0;
	}

	static action_set_gravity([direction, gravity], relative) {
		direction = (!relative ? direction : this.currentInstance.vars.getBuiltIn("gravity_direction") + direction); // lol
		this.currentInstance.vars.setBuiltIn("gravity_direction", direction);
		gravity = (!relative ? gravity : this.currentInstance.vars.getBuiltIn("gravity") + gravity);
		this.currentInstance.vars.setBuiltIn("gravity", gravity);
		return 0;
	}

	static action_reverse_xdir([]) {
		this.currentInstance.vars.setBuiltInCall("hspeed", this.currentInstance.vars.getBuiltIn("hspeed") * -1);
		return 0;
	}

	static action_reverse_ydir([]) {
		this.currentInstance.vars.setBuiltInCall("vspeed", this.currentInstance.vars.getBuiltIn("vspeed") * -1);
		return 0;
	}

	static action_set_friction([friction], relative) {
		friction = (!relative ? friction : this.currentInstance.vars.getBuiltIn("friction") + friction);
		this.currentInstance.vars.setBuiltIn("friction", friction);
		return 0;
	}

	// ### Jump

	static action_move_to([x, y], relative) {
		x = (!relative ? x : this.currentInstance.vars.getBuiltIn("x") + x);
		y = (!relative ? y : this.currentInstance.vars.getBuiltIn("y") + y);
		this.currentInstance.vars.setBuiltIn("x", x);
		this.currentInstance.vars.setBuiltIn("y", y);
		return 0;
	}

	static action_move_start([]) {
		this.currentInstance.vars.setBuiltIn("x", this.currentInstance.vars.getBuiltIn("xstart"));
		this.currentInstance.vars.setBuiltIn("y", this.currentInstance.vars.getBuiltIn("ystart"));
		return 0;
	}

	static action_move_random([snapHor, snapVert]) {
		BuiltInFunctions.move_random.call(this, [snapHor, snapVert]);
		return 0;
	}

	static action_snap([snapHor, snapVert]) {
		BuiltInFunctions.move_snap.call(this, [snapHor, snapVert]);
		return 0;
	}

	static action_wrap([direction]) {
		const horizontal = (direction == 0 || direction == 2);
		const vertical = (direction == 1 || direction == 2);

		let spriteW = 0;
		let spriteH = 0;

		if (this.currentInstance.sprite) {
			const image = this.currentInstance.sprite.images[this.currentInstance.getImageIndex()];
			if (image) {
				spriteW = image.image.width;
				spriteH = image.image.height;
			}
		}

		if (horizontal) {
			const x = this.currentInstance.vars.getBuiltIn("x");
			if (x >= this.game.room.width
				&& this.currentInstance.vars.getBuiltIn("hspeed") > 0) {
				this.currentInstance.vars.setBuiltIn("x", x - this.game.room.width - spriteW);
			} else
			if (x < 0
				&& this.currentInstance.vars.getBuiltIn("hspeed") < 0) {
				this.currentInstance.vars.setBuiltIn("x", this.game.room.width + x + spriteW);
			}
		}

		if (vertical) {
			const y = this.currentInstance.vars.getBuiltIn("y");
			if (y >= this.game.room.height
				&& this.currentInstance.vars.getBuiltIn("vspeed") > 0) {
				this.currentInstance.vars.setBuiltIn("y", y - this.game.room.height - spriteH);
			} else
			if (y < 0
				&& this.currentInstance.vars.getBuiltIn("vspeed") < 0) {
				this.currentInstance.vars.setBuiltIn("y", this.game.room.height + y + spriteH);
			}
		}

		return 0;
	}

	static action_move_contact([_]) {
		throw new EngineException("Function action_move_contact is not implemented");
		// return 0;
	}

	static action_bounce([precise, against]) {
		if (against == 0) {
			BuiltInFunctions.move_bounce_solid.call(this, [precise]);
		} else if (against == 1) {
			BuiltInFunctions.move_bounce_all.call(this, [precise]);
		}
		return 0;
	}

	// ### Paths

	static action_path([_]) {
		throw new EngineException("Function action_path is not implemented");
		// return 0;
	}

	static action_path_end([_]) {
		throw new EngineException("Function action_path_end is not implemented");
		// return 0;
	}

	static action_path_position([_]) {
		throw new EngineException("Function action_path_position is not implemented");
		// return 0;
	}

	static action_path_speed([_]) {
		throw new EngineException("Function action_path_speed is not implemented");
		// return 0;
	}

	// ### Steps

	static action_linear_step([_]) {
		throw new EngineException("Function action_linear_step is not implemented");
		// return 0;
	}

	static action_potential_step([_]) {
		throw new EngineException("Function action_potential_step is not implemented");
		// return 0;
	}

	// ## main1

	// ### Objects

	static async action_create_object([object, x, y], relative) {
		x = (!relative ? x : this.currentInstance.vars.getBuiltIn("x") + x);
		y = (!relative ? y : this.currentInstance.vars.getBuiltIn("y") + y);

		await BuiltInFunctions.instance_create.call(this, [x, y, object]);

		return 0;
	}

	static action_create_object_motion([_]) {
		throw new EngineException("Function action_create_object_motion is not implemented");
		// return 0;
	}

	static action_create_object_random([_]) {
		throw new EngineException("Function action_create_object_random is not implemented");
		// return 0;
	}

	static action_change_object([_]) {
		throw new EngineException("Function action_change_object is not implemented");
		// return 0;
	}

	static async action_kill_object([]) {
		await BuiltInFunctions.instance_destroy.call(this, []);
		return 0;
	}

	static action_kill_position([_]) {
		throw new EngineException("Function action_kill_position is not implemented");
		// return 0;
	}

	/// ### Sprite

	static action_sprite_set([sprite, subimage, speed]) {
		this.currentInstance.vars.setBuiltInCall("sprite_index", sprite);
		if (subimage != -1) {
			this.currentInstance.vars.setBuiltIn("image_index", subimage);
		}
		this.currentInstance.vars.setBuiltIn("image_speed", speed);
		return 0;
	}

	static action_sprite_transform([_]) {
		throw new EngineException("Function action_sprite_transform is not implemented");
		// return 0;
	}

	static action_sprite_color([_]) {
		throw new EngineException("Function action_sprite_color is not implemented");
		// return 0;
	}

	/// ### Sounds

	static action_sound([_]) {
		throw new EngineException("Function action_sound is not implemented");
		// return 0;
	}

	static action_end_sound([_]) {
		throw new EngineException("Function action_end_sound is not implemented");
		// return 0;
	}

	static action_if_sound([_]) {
		throw new EngineException("Function action_if_sound is not implemented");
		// return 0;
	}

	/// ### Rooms

	static action_previous_room([transition]) { // eslint-disable-line no-unused-vars
		// TODO transition
		BuiltInFunctions.room_goto_previous.call(this, []);
		return 0;
	}

	static action_next_room([transition]) { // eslint-disable-line no-unused-vars
		// TODO transition
		BuiltInFunctions.room_goto_next.call(this, []);
		return 0;
	}

	static action_current_room([transition]) { // eslint-disable-line no-unused-vars
		// TODO transition
		BuiltInFunctions.room_restart.call(this, []);
		return 0;
	}

	static action_another_room([newRoom, transition]) { // eslint-disable-line no-unused-vars
		// TODO transition
		BuiltInFunctions.room_goto.call(this, [newRoom]);
		return 0;
	}

	static action_if_previous_room([]) {
		return (BuiltInFunctions.room_previous.call(this, [this.game.room.resource.id]) != -1) ? 1 : 0;
	}

	static action_if_next_room([]) {
		return (BuiltInFunctions.room_next.call(this, [this.game.room.resource.id]) != -1) ? 1 : 0;
	}

	// ## main2

	// ### Timing

	static action_set_alarm([numberOfSteps, inAlarmNo], relative) {
		numberOfSteps = (!relative ? numberOfSteps : this.currentInstance.vars.getBuiltInArray("alarm", [inAlarmNo]) + numberOfSteps);
		this.currentInstance.vars.setBuiltInArray("alarm", [inAlarmNo], numberOfSteps);
		return 0;
	}

	static async action_sleep([milliseconds, redraw]) {
		// TODO read with redraw
		if (redraw) {
			//
		}
		await BuiltInFunctions.sleep.call(this, [milliseconds]);
		return 0;
	}

	static action_set_timeline([_]) {
		throw new EngineException("Function action_set_timeline is not implemented");
		// return 0;
	}

	static action_timeline_set([_]) {
		throw new EngineException("Function action_timeline_set is not implemented");
		// return 0;
	}

	static action_set_timeline_position([_]) {
		throw new EngineException("Function action_set_timeline_position is not implemented");
		// return 0;
	}

	static action_set_timeline_speed([_]) {
		throw new EngineException("Function action_set_timeline_speed is not implemented");
		// return 0;
	}

	static action_timeline_start([_]) {
		throw new EngineException("Function action_timeline_start is not implemented");
		// return 0;
	}

	static action_timeline_pause([_]) {
		throw new EngineException("Function action_timeline_pause is not implemented");
		// return 0;
	}

	static action_timeline_stop([_]) {
		throw new EngineException("Function action_timeline_stop is not implemented");
		// return 0;
	}

	// ### Info

	static action_message([message]) {
		BuiltInFunctions.show_message.call(this, [message]);
		return 0;
	}

	static action_show_info([_]) {
		throw new EngineException("Function action_show_info is not implemented");
		// return 0;
	}

	static action_show_video([_]) {
		throw new EngineException("Function action_show_video is not implemented");
		// return 0;
	}

	static action_splash_text([_]) {
		throw new EngineException("Function action_splash_text is not implemented");
		// return 0;
	}

	static action_splash_image([_]) {
		throw new EngineException("Function action_splash_image is not implemented");
		// return 0;
	}

	static action_splash_web([_]) {
		throw new EngineException("Function action_splash_web is not implemented");
		// return 0;
	}

	static action_splash_video([_]) {
		throw new EngineException("Function action_splash_video is not implemented");
		// return 0;
	}

	static action_splash_settings([_]) {
		throw new EngineException("Function action_splash_settings is not implemented");
		// return 0;
	}

	// ### Game

	static action_restart_game([_]) {
		throw new EngineException("Function action_restart_game is not implemented");
		// return 0;
	}

	static action_end_game([]) {
		BuiltInFunctions.game_end.call(this, []);
		return 0;
	}

	static action_save_game([_]) {
		throw new EngineException("Function action_save_game is not implemented");
		// return 0;
	}

	static action_load_game([_]) {
		throw new EngineException("Function action_load_game is not implemented");
		// return 0;
	}

	// ### Resources

	static action_replace_sprite([_]) {
		throw new EngineException("Function action_replace_sprite is not implemented");
		// return 0;
	}

	static action_replace_sound([_]) {
		throw new EngineException("Function action_replace_sound is not implemented");
		// return 0;
	}

	static action_replace_background([_]) {
		throw new EngineException("Function action_replace_background is not implemented");
		// return 0;
	}

	// ## control

	// ### Questions

	static action_if_empty([x, y, objects], relative) {
		x = (!relative ? x : this.currentInstance.vars.getBuiltIn("x") + x);
		y = (!relative ? y : this.currentInstance.vars.getBuiltIn("y") + y);
		if (objects == 0) { // Only solid
			return BuiltInFunctions.place_free.call(this, [x, y]);
		} else if (objects == 1) { // All
			return BuiltInFunctions.place_empty.call(this, [x, y]);
		}
		return 0;
	}

	static action_if_collision([x, y, objects], relative) {
		x = (!relative ? x : this.currentInstance.vars.getBuiltIn("x") + x);
		y = (!relative ? y : this.currentInstance.vars.getBuiltIn("y") + y);
		if (objects == 0) { // Only solid
			return !(BuiltInFunctions.place_free.call(this, [x, y]));
		} else if (objects == 1) { // All
			return !(BuiltInFunctions.place_empty.call(this, [x, y]));
		}
		return 0;
	}

	static action_if_object([object, x, y], relative) {
		x = (!relative ? x : this.currentInstance.vars.getBuiltIn("x") + x);
		y = (!relative ? y : this.currentInstance.vars.getBuiltIn("y") + y);
		return BuiltInFunctions.place_meeting.call(this, [x, y, object]);
	}

	static action_if_number([object, number, operation]) {
		const result = BuiltInFunctions.instance_number.call(this, [object]);
		if (operation == 0) { // Equal to
			return (result === number) ? 1 : 0;
		} else if (operation == 1) { // Smaller than
			return (result < number) ? 1 : 0;
		} else if (operation == 2) { // Larger than
			return (result > number) ? 1 : 0;
		}
		return 0;
	}

	static action_if_dice([sides]) {
		return ((Math.random() * sides) < 1) ? 1 : 0;
	}

	static action_if_question([question]) {
		return BuiltInFunctions.show_question.call(this, [question]);
	}

	static action_if([expression]) {
		return expression;
	}

	static action_if_mouse([button]) {
		return BuiltInFunctions.mouse_check_button.call(this, [button]);
	}

	static action_if_aligned([snapHor, snapVert]) {
		return BuiltInFunctions.place_snapped.call(this, [snapHor, snapVert]);
	}

	// ### Other

	static action_inherited([_]) {
		throw new EngineException("Function action_inherited is not implemented");
		// return 0;
	}

	// ### Code

	static action_execute_script([script, argument0, argument1, argument2, argument3, argument4]) {
		const scriptResource = this.game.getResourceById("ProjectScript", script);

		if (scriptResource) {
			return this.execute(this.game.gmlCache.get(scriptResource), this.currentInstance, this.currentOther,
				[argument0, argument1, argument2, argument3, argument4]);
		}
		return 0;
	}

	// ### Variables

	static action_if_variable([variable, value, operation]) {
		if (typeof variable !== typeof value) {
			throw this.game.makeNonFatalError({
					type: "cannot_compare_arguments",
					a: variable,
					b: value,
				}, "Cannot compare arguments. (" + variable.toString() +" has a different type than " + value.toString() + ")");
		}

		switch (operation) {
			case 0: // equal to
				return (variable == value) ? 1 : 0;
			case 1: // smaller than
				return (variable < value) ? 1 : 0;
			case 2: // larger than
				return (variable > value) ? 1 : 0;
		}

		return 0;
	}

	static action_draw_variable([_]) {
		throw new EngineException("Function action_draw_variable is not implemented");
		// return 0;
	}

	// ## score

	// ### Score

	static action_set_score([newScore], relative) {
		newScore = (!relative ? newScore : this.game.globalVars.getBuiltIn("score") + newScore);
		this.game.globalVars.setBuiltIn("score", newScore);
		return 0;
	}

	static action_if_score([value, operation]) {
		const score = this.game.globalVars.getBuiltIn("score");
		switch (operation) {
			case 0: // equal to
				return (score === value) ? 1 : 0;
			case 1: // smaller than
				return (score < value) ? 1 : 0;
			case 2: // larger than
				return (score > value) ? 1 : 0;
		}
		return 0;
	}

	static action_draw_score([_]) {
		throw new EngineException("Function action_draw_score is not implemented");
		// return 0;
	}

	static action_highscore_show([_]) {
		throw new EngineException("Function action_highscore_show is not implemented");
		// return 0;
	}

	static action_highscore_clear([_]) {
		throw new EngineException("Function action_highscore_clear is not implemented");
		// return 0;
	}

	// ### Lives

	static action_set_life([newLives], relative) {
		newLives = (!relative ? newLives : this.game.globalVars.getBuiltIn("lives") + newLives);
		this.game.globalVars.setBuiltInCall("lives", newLives);
		return 0;
	}

	static action_if_life([value, operation]) {
		const lives = this.game.globalVars.getBuiltIn("lives");
		switch (operation) {
			case 0: // equal to
				return (lives === value) ? 1 : 0;
			case 1: // smaller than
				return (lives < value) ? 1 : 0;
			case 2: // larger than
				return (lives > value) ? 1 : 0;
		}
		return 0;
	}

	static action_draw_life([_]) {
		throw new EngineException("Function action_draw_life is not implemented");
		// return 0;
	}

	static action_draw_life_images([_]) {
		throw new EngineException("Function action_draw_life_images is not implemented");
		// return 0;
	}

	// ### Health

	static action_set_health([value], relative) {
		value = (!relative ? value : this.game.globalVars.getBuiltIn("health") + value);
		this.game.globalVars.setBuiltInCall("health", value);
		return 0;
	}

	static action_if_health([value, operation]) {
		const health = this.game.globalVars.getBuiltIn("health");
		switch (operation) {
			case 0: // equal to
				return (health === value) ? 1 : 0;
			case 1: // smaller than
				return (health < value) ? 1 : 0;
			case 2: // larger than
				return (health > value) ? 1 : 0;
		}
		return 0;
	}

	static action_draw_health([_]) {
		throw new EngineException("Function action_draw_health is not implemented");
		// return 0;
	}

	static action_set_caption([_]) {
		throw new EngineException("Function action_set_caption is not implemented");
		// return 0;
	}

	// ## extra

	// ### Particles

	static action_partsyst_create([_]) {
		throw new EngineException("Function action_partsyst_create is not implemented");
		// return 0;
	}

	static action_partsyst_destroy([_]) {
		throw new EngineException("Function action_partsyst_destroy is not implemented");
		// return 0;
	}

	static action_partsyst_clear([_]) {
		throw new EngineException("Function action_partsyst_clear is not implemented");
		// return 0;
	}

	static action_parttype_create([_]) {
		throw new EngineException("Function action_parttype_create is not implemented");
		// return 0;
	}

	static action_parttype_color([_]) {
		throw new EngineException("Function action_parttype_color is not implemented");
		// return 0;
	}

	static action_parttype_life([_]) {
		throw new EngineException("Function action_parttype_life is not implemented");
		// return 0;
	}

	static action_parttype_speed([_]) {
		throw new EngineException("Function action_parttype_speed is not implemented");
		// return 0;
	}

	static action_parttype_gravity([_]) {
		throw new EngineException("Function action_parttype_gravity is not implemented");
		// return 0;
	}

	static action_parttype_secondary([_]) {
		throw new EngineException("Function action_parttype_secondary is not implemented");
		// return 0;
	}

	static action_partemit_create([_]) {
		throw new EngineException("Function action_partemit_create is not implemented");
		// return 0;
	}

	static action_partemit_destroy([_]) {
		throw new EngineException("Function action_partemit_destroy is not implemented");
		// return 0;
	}

	static action_partemit_burst([_]) {
		throw new EngineException("Function action_partemit_burst is not implemented");
		// return 0;
	}

	static action_partemit_stream([_]) {
		throw new EngineException("Function action_partemit_stream is not implemented");
		// return 0;
	}

	// ### CD

	static action_cd_play([_]) {
		throw new EngineException("Function action_cd_play is not implemented");
		// return 0;
	}

	static action_cd_stop([_]) {
		throw new EngineException("Function action_cd_stop is not implemented");
		// return 0;
	}

	static action_cd_pause([_]) {
		throw new EngineException("Function action_cd_pause is not implemented");
		// return 0;
	}

	static action_cd_resume([_]) {
		throw new EngineException("Function action_cd_resume is not implemented");
		// return 0;
	}

	static action_cd_present([_]) {
		throw new EngineException("Function action_cd_present is not implemented");
		// return 0;
	}

	static action_cd_playing([_]) {
		throw new EngineException("Function action_cd_playing is not implemented");
		// return 0;
	}

	// ### Other

	static action_set_cursor([sprite, cursor]) {
		this.game.globalVars.setBuiltInCall("cursor_sprite", sprite);

		if (cursor == 0) {
			this.game.canvas.classList.add("no-cursor");
		} else if (cursor == 1) {
			this.game.canvas.classList.remove("no-cursor");
		}
		return 0;
	}

	static action_webpage([_]) {
		throw new EngineException("Function action_webpage is not implemented");
		// return 0;
	}

	// ## draw

	// ### Drawing

	static action_draw_sprite([sprite, x, y, subimage], relative) {
		x = (!relative ? x : this.currentInstance.vars.getBuiltIn("x") + x);
		y = (!relative ? y : this.currentInstance.vars.getBuiltIn("y") + y);
		subimage = (subimage != -1) ? subimage : this.currentInstance.vars.getBuiltIn("image_index");
		BuiltInFunctions.draw_sprite.call(this, [sprite, subimage, x, y]);
		return 0;
	}

	static action_draw_background([_]) {
		throw new EngineException("Function action_draw_background is not implemented");
		// return 0;
	}

	static action_draw_text([text, x, y], relative) {
		x = (!relative ? x : this.currentInstance.vars.getBuiltIn("x") + x);
		y = (!relative ? y : this.currentInstance.vars.getBuiltIn("y") + y);
		BuiltInFunctions.draw_text.call(this, [x, y, text]);
		return 0;
	}

	static action_draw_text_transformed([_]) {
		throw new EngineException("Function action_draw_text_transformed is not implemented");
		// return 0;
	}

	static action_draw_rectangle([x1, y1, x2, y2, filled], relative) {
		x1 = (!relative ? x1 : this.currentInstance.vars.getBuiltIn("x") + x1);
		y1 = (!relative ? y1 : this.currentInstance.vars.getBuiltIn("y") + y1);
		x2 = (!relative ? x2 : this.currentInstance.vars.getBuiltIn("x") + x2);
		y2 = (!relative ? y2 : this.currentInstance.vars.getBuiltIn("y") + y2);
		BuiltInFunctions.draw_rectangle.call(this, [x1, y1, x2, y2, filled]); // 0=filled, 1=outline
		return 0;
	}

	static action_draw_gradient_hor([_]) {
		throw new EngineException("Function action_draw_gradient_hor is not implemented");
		// return 0;
	}

	static action_draw_gradient_vert([_]) {
		throw new EngineException("Function action_draw_gradient_vert is not implemented");
		// return 0;
	}

	static action_draw_ellipse([x1, y1, x2, y2, filled], relative) {
		x1 = (!relative ? x1 : this.currentInstance.vars.getBuiltIn("x") + x1);
		y1 = (!relative ? y1 : this.currentInstance.vars.getBuiltIn("y") + y1);
		x2 = (!relative ? x2 : this.currentInstance.vars.getBuiltIn("x") + x2);
		y2 = (!relative ? y2 : this.currentInstance.vars.getBuiltIn("y") + y2);
		BuiltInFunctions.draw_ellipse.call(this, [x1, y1, x2, y2, filled]); // 0=filled, 1=outline
		return 0;
	}

	static action_draw_ellipse_gradient([_]) {
		throw new EngineException("Function action_draw_ellipse_gradient is not implemented");
		// return 0;
	}

	static action_draw_line([x1, y1, x2, y2], relative) {
		x1 = (!relative ? x1 : this.currentInstance.vars.getBuiltIn("x") + x1);
		y1 = (!relative ? y1 : this.currentInstance.vars.getBuiltIn("y") + y1);
		x2 = (!relative ? x2 : this.currentInstance.vars.getBuiltIn("x") + x2);
		y2 = (!relative ? y2 : this.currentInstance.vars.getBuiltIn("y") + y2);
		BuiltInFunctions.draw_line.call(this, [x1, y1, x2, y2]);
		return 0;
	}

	static action_draw_arrow([_]) {
		throw new EngineException("Function action_draw_arrow is not implemented");
		// return 0;
	}

	// ### Settings

	static action_color([color]) {
		BuiltInFunctions.draw_set_color.call(this, [color]);
		return 0;
	}

	static action_font([font, align]) {
		BuiltInFunctions.draw_set_font.call(this, [font]);
		BuiltInFunctions.draw_set_halign.call(this, [align]); // 0=left, 1=center, 2=right
		return 0;
	}

	static action_fullscreen([_]) {
		throw new EngineException("Function action_fullscreen is not implemented");
		// return 0;
	}

	// ### Other

	static action_snapshot([_]) {
		throw new EngineException("Function action_snapshot is not implemented");
		// return 0;
	}

	static action_effect([_]) {
		throw new EngineException("Function action_effect is not implemented");
		// return 0;
	}

	// # Undocumented functions

	static background_name([_]) {
		throw new EngineException("Function background_name is not implemented");
		// return 0;
	}

	static external_call0([_]) {
		throw new EngineException("Function external_call0 is not implemented");
		// return 0;
	}

	static external_call1([_]) {
		throw new EngineException("Function external_call1 is not implemented");
		// return 0;
	}

	static external_call2([_]) {
		throw new EngineException("Function external_call2 is not implemented");
		// return 0;
	}

	static external_call3([_]) {
		throw new EngineException("Function external_call3 is not implemented");
		// return 0;
	}

	static external_call4([_]) {
		throw new EngineException("Function external_call4 is not implemented");
		// return 0;
	}

	static external_call5([_]) {
		throw new EngineException("Function external_call5 is not implemented");
		// return 0;
	}

	static external_call6([_]) {
		throw new EngineException("Function external_call6 is not implemented");
		// return 0;
	}

	static external_call7([_]) {
		throw new EngineException("Function external_call7 is not implemented");
		// return 0;
	}

	static external_call8([_]) {
		throw new EngineException("Function external_call8 is not implemented");
		// return 0;
	}

	static external_define0([_]) {
		throw new EngineException("Function external_define0 is not implemented");
		// return 0;
	}

	static external_define1([_]) {
		throw new EngineException("Function external_define1 is not implemented");
		// return 0;
	}

	static external_define2([_]) {
		throw new EngineException("Function external_define2 is not implemented");
		// return 0;
	}

	static external_define3([_]) {
		throw new EngineException("Function external_define3 is not implemented");
		// return 0;
	}

	static external_define4([_]) {
		throw new EngineException("Function external_define4 is not implemented");
		// return 0;
	}

	static external_define5([_]) {
		throw new EngineException("Function external_define5 is not implemented");
		// return 0;
	}

	static external_define6([_]) {
		throw new EngineException("Function external_define6 is not implemented");
		// return 0;
	}

	static external_define7([_]) {
		throw new EngineException("Function external_define7 is not implemented");
		// return 0;
	}

	static external_define8([_]) {
		throw new EngineException("Function external_define8 is not implemented");
		// return 0;
	}

	static file_close([_]) {
		throw new EngineException("Function file_close is not implemented");
		// return 0;
	}

	static file_eof([_]) {
		throw new EngineException("Function file_eof is not implemented");
		// return 0;
	}

	static file_eoln([_]) {
		throw new EngineException("Function file_eoln is not implemented");
		// return 0;
	}

	static file_open_append([_]) {
		throw new EngineException("Function file_open_append is not implemented");
		// return 0;
	}

	static file_open_read([_]) {
		throw new EngineException("Function file_open_read is not implemented");
		// return 0;
	}

	static file_open_write([_]) {
		throw new EngineException("Function file_open_write is not implemented");
		// return 0;
	}

	static file_read_real([_]) {
		throw new EngineException("Function file_read_real is not implemented");
		// return 0;
	}

	static file_read_string([_]) {
		throw new EngineException("Function file_read_string is not implemented");
		// return 0;
	}

	static file_readln([_]) {
		throw new EngineException("Function file_readln is not implemented");
		// return 0;
	}

	static file_write_real([_]) {
		throw new EngineException("Function file_write_real is not implemented");
		// return 0;
	}

	static file_write_string([_]) {
		throw new EngineException("Function file_write_string is not implemented");
		// return 0;
	}

	static file_writeln([_]) {
		throw new EngineException("Function file_writeln is not implemented");
		// return 0;
	}

	static font_get_size([_]) {
		throw new EngineException("Function font_get_size is not implemented");
		// return 0;
	}

	static font_name([_]) {
		throw new EngineException("Function font_name is not implemented");
		// return 0;
	}

	static instance_sprite([_]) {
		throw new EngineException("Function instance_sprite is not implemented");
		// return 0;
	}

	static make_color([_]) {
		throw new EngineException("Function make_color is not implemented");
		// return 0;
	}

	static max3([_]) {
		throw new EngineException("Function max3 is not implemented");
		// return 0;
	}

	static min3([_]) {
		throw new EngineException("Function min3 is not implemented");
		// return 0;
	}

	static move_bounce([_]) {
		throw new EngineException("Function move_bounce is not implemented");
		// return 0;
	}

	static move_contact([_]) {
		throw new EngineException("Function move_contact is not implemented");
		// return 0;
	}

	static object_name([_]) {
		throw new EngineException("Function object_name is not implemented");
		// return 0;
	}

	static part_type_alpha([_]) {
		throw new EngineException("Function part_type_alpha is not implemented");
		// return 0;
	}

	static part_type_color([_]) {
		throw new EngineException("Function part_type_color is not implemented");
		// return 0;
	}

	static path_name([_]) {
		throw new EngineException("Function path_name is not implemented");
		// return 0;
	}

	static room_name([_]) {
		throw new EngineException("Function room_name is not implemented");
		// return 0;
	}

	static script_name([_]) {
		throw new EngineException("Function script_name is not implemented");
		// return 0;
	}

	static show_image([_]) {
		throw new EngineException("Function show_image is not implemented");
		// return 0;
	}

	static show_text([_]) {
		throw new EngineException("Function show_text is not implemented");
		// return 0;
	}

	static show_video([_]) {
		throw new EngineException("Function show_video is not implemented");
		// return 0;
	}

	static sound_name([_]) {
		throw new EngineException("Function sound_name is not implemented");
		// return 0;
	}

	static sprite_name([_]) {
		throw new EngineException("Function sprite_name is not implemented");
		// return 0;
	}

	static texture_exists([_]) {
		throw new EngineException("Function texture_exists is not implemented");
		// return 0;
	}

	static tile_delete_at([_]) {
		throw new EngineException("Function tile_delete_at is not implemented");
		// return 0;
	}

	static tile_find([_]) {
		throw new EngineException("Function tile_find is not implemented");
		// return 0;
	}

	static timeline_name([_]) {
		throw new EngineException("Function timeline_name is not implemented");
		// return 0;
	}

	/*
	static _ ([_]) {
		throw new EngineException("Function _ is not implemented");
		// return 0;
	}
	*/
}