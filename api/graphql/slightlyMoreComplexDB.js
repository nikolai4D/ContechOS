const slightlyMoreComplexDB = {
    type_data: [
        {
            id: "n_t_1",
            title: "project",
        },
        {
            id: "n_t_2",
            title: "profile",
        },
        {
            id: "n_t_3",
            title: "phase",
        },
        {
            id: "n_t_4",
            title: "property",
        }
    ],
    type_rel: [
        {
            id: "r_t_1",
            title: "profile_to_project",
            parentRel: null,
            source: "n_t_2",
            target: "n_t_1"
        },
        {
            id: "r_t_2",
            title: "phase_to_project",
            parentRel: null,
            source: "n_t_3",
            target: "n_t_1"
        },
        {
            id: "r_t_3",
            title: "property_to_profile",
            parentRel: null,
            source: "n_t_4",
            target: "n_t_2"
        },
        {
            id: "r_t_4",
            title: "property_to_phase",
            parentRel: null,
            source: "n_t_4",
            target: "n_t_3"
        },
    ],
    instance_data: [
        {
            id: "n_i_1",
            title: "Aulan1",
            parentId: "n_t_1"
        },
        {
            id: "n_i_2",
            title: "Aulan2",
            parentId: "n_t_1"
        },
        {
            id: "n_i_3",
            title: "profile1",
            parentId: "n_t_2"
        },
        {
            id: "n_i_4",
            title: "profile2",
            parentId: "n_t_2"
        },
        {
            id: "n_i_5",
            title: "phase1",
            parentId: "n_t_3"
        },
        {
            id: "n_i_6",
            title: "phase2",
            parentId: "n_t_3"
        },
        {
            id: "n_i_7",
            title: "property1",
            parentId: "n_t_4"
        },
        {
            id: "n_i_8",
            title: "property2",
            parentId: "n_t_4"
        },
        {
            id: "n_i_9",
            title: "property3",
            parentId: "n_t_4"
        },
        {
            id: "n_i_10",
            title: "property4",
            parentId: "n_t_4"
        },
    ],
    instance_rel: [
        {
            id: "r_i_1",
            title: "prof1_to_proj1",
            parentId: "r_t_1",
            source: "n_i_3",
            target: "n_i_1"
        },
        {
            id: "r_i_2",
            title: "prof2_to_proj1",
            parentId: "r_t_1",
            source: "n_i_4",
            target: "n_i_1"
        },
        {
            id: "r_i_3",
            title: "phas1_to_proj1",
            parentId: "r_t_2",
            source: "n_i_5",
            target: "n_i_1"
        },
        {
            id: "r_i_4",
            title: "prop1_to_prof1",
            parentId: "r_t_3",
            source: "n_i_7",
            target: "n_i_3"
        },
        {
            id: "r_i_5",
            title: "prop1_to_pha1",
            parentId: "r_t_4",
            source: "n_i_7",
            target: "n_i_5"
        },
        {
            id: "r_i_6",
            title: "prop2_to_prof1",
            parentId: "r_t_3",
            source: "n_i_8",
            target: "n_i_3"
        },
    ],
}

module.exports = slightlyMoreComplexDB