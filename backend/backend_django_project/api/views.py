from rest_framework import generics, status
from . import models
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from . import serializers
from . import filters
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from rest_framework.response import Response
from . import exceptions
import platform
import inspect
import traceback
import re
import numpy
import datetime
from . import utils
import rest_framework.exceptions
from rest_framework.parsers import MultiPartParser
from django.http import FileResponse, Http404, HttpResponseServerError
from rest_framework.views import APIView
from django.conf import settings
import os.path


def response_is_paginated(response_data):
    return type(response_data) == dict


class AddCountMixin:

    def list(request, *args, **kwargs):
        """If the response status is 200, returns these additional fields:
        'count': the number of objects retrieved after pagination (if required) and after filtering,
        'total_count': the number of objects before pagination (if required) and after filtering
        """

        response = super().list(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:

            if response_is_paginated(response.data):

                response.data = {"count": len(response.data["data"]),
                                 "total_count": response.data["total_count"],
                                 "data": response.data["data"]}
            else:
                len_response_data = len(response.data)
                response.data = {"count": len_response_data,
                                 "total_count": len_response_data, "data": response.data}

        return response


@extend_schema(description="")
class CustomListAPIView(AddCountMixin, generics.ListAPIView):
    None


@extend_schema(description="")
class CustomListCreateAPIView(AddCountMixin, generics.ListCreateAPIView):
    None


class UserPhoto(APIView):
    def get_object(self, pk):
        try:
            user = models.User.objects.get(pk=pk)
        except models.User.DoesNotExist:
            raise Http404
        else:
            if not user.photo:
                raise Http404
            else:
                return user.photo.path

    def get(self, request, pk, format=None):
        relative_photo_path = self.get_object(pk)

        absolute_photo_path = os.path.join(
            settings.MEDIA_ROOT, relative_photo_path)

        try:
            return FileResponse(open(absolute_photo_path, "rb"))
        except IOError:
            raise exceptions.CustomServerErrorExceptionHandler(
                "Error reading the photo.")


class UserList(CustomListCreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = serializers.UserSerializer
    parser_classes = [MultiPartParser]


class UserDetail(generics.RetrieveUpdateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = serializers.UserSerializer
    parser_classes = [MultiPartParser]


class RoleList(CustomListCreateAPIView):
    queryset = models.Role.objects.all()
    serializer_class = serializers.RoleSerializer


class RoleDetail(generics.RetrieveUpdateAPIView):
    queryset = models.Role.objects.all()
    serializer_class = serializers.RoleSerializer

    def update(self, request, *args, **kwargs):
        """
            Deactivate role's users if the role is deactivated.
        """
        is_active_before_update = self.get_object().is_active

        response = super().update(request, *args, **kwargs)

        is_active_after_update = self.get_object().is_active

        if (is_active_before_update == True and is_active_after_update == False):
            models.User.objects.filter(role=self.get_object().id).update(is_active=False)

        return response

class PageList(CustomListCreateAPIView):
    queryset = models.Page.objects.all()
    serializer_class = serializers.PageSerializer

    def list(request, *args, **kwargs):
        """ If response status is 200, group pages by url"""

        response = super().list(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
                
                response.data['data'] = utils.PageUtils.group_pages_by_url(
                    response.data['data'])
                
        return response

class PageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Page.objects.all()
    serializer_class = serializers.PageSerializer


class EndpointList(CustomListCreateAPIView):
    queryset = models.Endpoint.objects.all()
    serializer_class = serializers.EndpointSerializer

class EndpointDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Endpoint.objects.all()
    serializer_class = serializers.EndpointSerializer

class EndpointsClusterList(CustomListCreateAPIView):
    queryset = models.EndPointsCluster.objects.all()
    serializer_class = serializers.EndpointsClusterSerializer

    def list(request, *args, **kwargs):
        """ If response status is 200, group clusters by resource"""

        response = super().list(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
                
                response.data['data'] = utils.EndpointsClusterUtils.group_clusters_by_resource(
                    response.data['data'])
                
        return response
                



class EndpointsClusterDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.EndPointsCluster.objects.all()
    serializer_class = serializers.EndpointsClusterSerializer

class StationinfoList(CustomListCreateAPIView):
    queryset = models.Stationinfo.objects.all()
    serializer_class = serializers.StationinfoSerializer


class StationinfoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Stationinfo.objects.all()
    serializer_class = serializers.StationinfoSerializer


class NetworkList(CustomListCreateAPIView):
    queryset = models.Networks.objects.all()
    serializer_class = serializers.NetworkSerializer


class NetworkDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Networks.objects.all()
    serializer_class = serializers.NetworkSerializer


class ReceiverList(CustomListCreateAPIView):
    queryset = models.Receivers.objects.all()
    serializer_class = serializers.ReceiverSerializer


class ReceiverDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Receivers.objects.all()
    serializer_class = serializers.ReceiverSerializer


class AntennaList(CustomListCreateAPIView):
    queryset = models.Antennas.objects.all()
    serializer_class = serializers.AntennaSerializer


class AntennaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Antennas.objects.all()
    serializer_class = serializers.AntennaSerializer


class StationList(CustomListCreateAPIView):
    queryset = models.Stations.objects.all()
    serializer_class = serializers.StationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = filters.StationFilter


class StationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Stations.objects.all()
    serializer_class = serializers.StationSerializer


class StationCodesList(CustomListAPIView):
    queryset = models.Stations.objects.none()
    serializer_class = serializers.StationCodeSerializer

    def get_queryset(self):
        return models.Stations.objects.all().filter(network_code__api_id=self.kwargs["network_api_id"]).values("station_code")

    def list(request, *args, **kwargs):
        """If the response status is 200, returns a list of station codes instead of an list of objects"""

        response = super().list(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:

            response.data["data"] = [station["station_code"]
                                     for station in response.data["data"]]

        return response


class AprCoordsList(CustomListCreateAPIView):
    queryset = models.AprCoords.objects.all()
    serializer_class = serializers.AprCoordsSerializer


class AprCoordsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.AprCoords.objects.all()
    serializer_class = serializers.AprCoordsSerializer


class AwsSyncList(CustomListCreateAPIView):
    queryset = models.AwsSync.objects.all()
    serializer_class = serializers.AprCoordsSerializer


class AwsSyncDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.AwsSync.objects.all()
    serializer_class = serializers.AprCoordsSerializer


class CountryList(AddCountMixin, generics.ListCreateAPIView):
    queryset = models.Country.objects.all()
    serializer_class = serializers.CountrySerializer


class CountryDetail(generics.RetrieveAPIView):
    queryset = models.Country.objects.all()
    serializer_class = serializers.CountrySerializer


class DataSourceList(CustomListCreateAPIView):
    queryset = models.DataSource.objects.all()
    serializer_class = serializers.DataSourceSerializer


class DataSourceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.DataSource.objects.all()
    serializer_class = serializers.DataSourceSerializer


class EarthquakesList(CustomListCreateAPIView):
    queryset = models.Earthquakes.objects.all()
    serializer_class = serializers.EarthquakesSerializer


class EarthquakesDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Earthquakes.objects.all()
    serializer_class = serializers.EarthquakesSerializer


class EtmParamsList(CustomListCreateAPIView):
    queryset = models.EtmParams.objects.all()
    serializer_class = serializers.EtmParamsSerializer


class EtmParamsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.EtmParams.objects.all()
    serializer_class = serializers.EtmParamsSerializer


class EtmsList(CustomListCreateAPIView):
    queryset = models.Etms.objects.all()
    serializer_class = serializers.EtmsSerializer


class EtmsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Etms.objects.all()
    serializer_class = serializers.EtmsSerializer


class EventsList(CustomListCreateAPIView):
    queryset = models.Events.objects.all()
    serializer_class = serializers.EventsSerializer


class EventsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Events.objects.all()
    serializer_class = serializers.EventsSerializer


class ExecutionsList(CustomListCreateAPIView):
    queryset = models.Executions.objects.all()
    serializer_class = serializers.ExecutionsSerializer


class ExecutionsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Executions.objects.all()
    serializer_class = serializers.ExecutionsSerializer


class GamitHtcList(CustomListCreateAPIView):
    queryset = models.GamitHtc.objects.all()
    serializer_class = serializers.GamitHtcSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = filters.GamitHtcFilter


class GamitHtcDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.GamitHtc.objects.all()
    serializer_class = serializers.GamitHtcSerializer


class GamitSolnList(CustomListCreateAPIView):
    queryset = models.GamitSoln.objects.all()
    serializer_class = serializers.GamitSolnSerializer


class GamitSolnDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.GamitSoln.objects.all()
    serializer_class = serializers.GamitSolnSerializer


class GamitSolnExcl(generics.ListCreateAPIView):
    queryset = models.GamitSolnExcl.objects.all()
    serializer_class = serializers.GamitSolnExclSerializer


class GamitSolnExclList(CustomListCreateAPIView):
    queryset = models.GamitSolnExcl.objects.all()
    serializer_class = serializers.GamitSolnExclSerializer


class GamitSolnExclDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.GamitSolnExcl.objects.all()
    serializer_class = serializers.GamitSolnExclSerializer


class GamitStatsList(CustomListCreateAPIView):
    queryset = models.GamitStats.objects.all()
    serializer_class = serializers.GamitStatsSerializer


class GamitStatsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.GamitStats.objects.all()
    serializer_class = serializers.GamitStatsSerializer


class GamitSubnetsList(CustomListCreateAPIView):
    queryset = models.GamitSubnets.objects.all()
    serializer_class = serializers.GamitSubnetsSerializer


class GamitSubnetsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.GamitSubnets.objects.all()
    serializer_class = serializers.GamitSubnetsSerializer


class GamitZtdList(CustomListCreateAPIView):
    queryset = models.GamitZtd.objects.all()
    serializer_class = serializers.GamitZtdSerializer


class GamitZtdDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.GamitZtd.objects.all()
    serializer_class = serializers.GamitZtdSerializer


class KeysList(CustomListCreateAPIView):
    queryset = models.Keys.objects.all()
    serializer_class = serializers.KeysSerializer


class KeysDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Keys.objects.all()
    serializer_class = serializers.KeysSerializer


class LocksList(CustomListCreateAPIView):
    queryset = models.Locks.objects.all()
    serializer_class = serializers.LocksSerializer


class LocksDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Locks.objects.all()
    serializer_class = serializers.LocksSerializer


class PppSolnList(CustomListCreateAPIView):
    queryset = models.PppSoln.objects.all()
    serializer_class = serializers.PppSolnSerializer


class PppSolnDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.PppSoln.objects.all()
    serializer_class = serializers.PppSolnSerializer


class PppSolnExclList(CustomListCreateAPIView):
    queryset = models.PppSolnExcl.objects.all()
    serializer_class = serializers.PppSolnExclSerializer


class PppSolnExclDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.PppSolnExcl.objects.all()
    serializer_class = serializers.PppSolnExclSerializer


class ReceiversList(CustomListCreateAPIView):
    queryset = models.Receivers.objects.all()
    serializer_class = serializers.ReceiversSerializer


class ReceiversDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Receivers.objects.all()
    serializer_class = serializers.ReceiversSerializer


class RinexList(CustomListCreateAPIView):
    queryset = models.Rinex.objects.all()
    serializer_class = serializers.RinexSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = filters.RinexFilter


class RinexDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Rinex.objects.all()
    serializer_class = serializers.RinexSerializer


class RinexSourcesInfoList(CustomListCreateAPIView):
    queryset = models.RinexSourcesInfo.objects.all()
    serializer_class = serializers.RinexSourcesInfoSerializer


class RinexSourcesInfoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.RinexSourcesInfo.objects.all()
    serializer_class = serializers.RinexSourcesInfoSerializer


class RinexTankStructList(CustomListCreateAPIView):
    queryset = models.RinexTankStruct.objects.all()
    serializer_class = serializers.RinexTankStructSerializer


class RinexTankStructDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.RinexTankStruct.objects.all()
    serializer_class = serializers.RinexTankStructSerializer


class SourcesFormatsList(CustomListCreateAPIView):
    queryset = models.SourcesFormats.objects.all()
    serializer_class = serializers.SourcesFormatsSerializer


class SourcesFormatsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.SourcesFormats.objects.all()
    serializer_class = serializers.SourcesFormatsSerializer


class SourcesServersList(CustomListCreateAPIView):
    queryset = models.SourcesServers.objects.all()
    serializer_class = serializers.SourcesServersSerializer


class SourcesServersDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.SourcesServers.objects.all()
    serializer_class = serializers.SourcesServersSerializer


class SourcesStationsList(CustomListCreateAPIView):
    queryset = models.SourcesStations.objects.all()
    serializer_class = serializers.SourcesStationsSerializer


class SourcesStationsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.SourcesStations.objects.all()
    serializer_class = serializers.SourcesStationsSerializer


class StacksList(CustomListCreateAPIView):
    queryset = models.Stacks.objects.all()
    serializer_class = serializers.StacksSerializer


class StacksDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Stacks.objects.all()
    serializer_class = serializers.StacksSerializer


class StationaliasList(CustomListCreateAPIView):
    queryset = models.Stationalias.objects.all()
    serializer_class = serializers.StationaliasSerializer


class StationaliasDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Stationalias.objects.all()
    serializer_class = serializers.StationaliasSerializer


class EventManager():

    @staticmethod
    def create_event(**kwargs):
        values = dict()

        values['event_type'] = 'info'
        values['network_code'] = None
        values['station_code'] = None
        values['year'] = None
        values['doy'] = None
        values['description'] = ''
        values['node'] = platform.node()
        values['stack'] = None

        module = inspect.getmodule(inspect.stack()[1][0])
        stack = traceback.extract_stack()[0:-2]

        if module is None:
            # just get the calling module
            values['module'] = inspect.stack()[1][3]
        else:
            # values['module'] = module.__name__ + '.' + inspect.stack()[1][3]  # just get the calling module
            values['module'] = module.__name__ + '.' + \
                stack[-1][2]  # just get the calling module

        # initialize the dictionary based on the input
        for key in kwargs:
            if key not in values.keys():
                raise exceptions.CustomValidationErrorExceptionHandler(
                    'Provided key not in list of valid fields.')

            arg = kwargs[key]
            values[key] = arg

        if values['event_type'] == 'error':
            # print the traceback until just before this call
            values['stack'] = ''.join(traceback.format_stack()[0:-2])
        else:
            values['stack'] = None

        EventManager.clean_str(values)

        models.Events.objects.create(**values)

    def clean_str(values):
        # remove any invalid chars that can cause problems in the database

        for key in values:
            s = values[key]
            if type(s) is str:
                s = re.sub(r'[^\x00-\x7f]+', '', s)
                s = s.replace('\'', '"')
                s = re.sub(r'BASH.*', '', s)
                s = re.sub(r'PSQL.*', '', s)
                values[key] = s

        return values


class StationinfoList(CustomListCreateAPIView):
    queryset = models.Stationinfo.objects.all()
    serializer_class = serializers.StationinfoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = filters.StationinfoFilter

    def post(self, request, *args, **kwargs):

        def pk_already_exists(serializer):
            return self.queryset.filter(network_code=serializer.validated_data['network_code'], station_code=serializer.validated_data['station_code'], date_start=serializer.validated_data['date_start']).exists()

        def records_are_equal(serializer, record):

            return (serializer.validated_data.get('receiver_code') == record.receiver_code and
                    serializer.validated_data.get('receiver_serial') == record.receiver_serial and
                    serializer.validated_data.get('antenna_code') == record.antenna_code and
                    serializer.validated_data.get('antenna_serial') == record.antenna_serial and
                    serializer.validated_data.get('antenna_height') == record.antenna_height and
                    serializer.validated_data.get('antenna_north') == record.antenna_north and
                    serializer.validated_data.get('antenna_east') == record.antenna_east and
                    serializer.validated_data.get('height_code') == record.height_code and
                    serializer.validated_data.get('radome_code') == record.radome_code)

        def modify_record_start_date(serializer, record):
            record.date_start = serializer.validated_data['date_start']
            record.save()

        def insert_update_event(serializer, previous_date):
            EventManager.create_event(description='The start date of the station information record ' +
                                      previous_date.strftime("%Y-%m-%d %H:%M:%S") +
                                      ' has been been modified to ' +
                                      serializer.validated_data['date_start'].strftime(
                                          "%Y-%m-%d %H:%M:%S"),
                                      station_code=serializer.validated_data['station_code'],
                                      network_code=serializer.validated_data['network_code'])

        def insert_create_event(serializer, created_object):
            EventManager.create_event(description='A new station information record was added:\n'
                                      + utils.StationInfoUtils.record_to_str(created_object),
                                      station_code=serializer.validated_data['station_code'],
                                      network_code=serializer.validated_data['network_code'])

        def insert_create_event_with_extra_description(serializer, record):
            EventManager.create_event(description='A new station information record was added:\n' +
                                      utils.StationInfoUtils.return_stninfo(serializer=serializer) +
                                      '\nThe previous DateEnd value was updated to ' +
                                      record.date_end.strftime(
                                          "%Y-%m-%d %H:%M:%S"),
                                      station_code=serializer.validated_data['station_code'],
                                      network_code=serializer.validated_data['network_code'])

        def modify_date_end(serializer, first_record):

            serializer.validated_data['date_end'] = first_record.date_start - \
                datetime.timedelta(seconds=1)

        def modify_last_record_end_date(serializer, last_record):
            last_record.date_end = serializer.validated_data['date_start'] - datetime.timedelta(
                seconds=1)
            last_record.save()

        def get_overlap_exception_detail(records_that_overlap):

            stroverlap = []

            for overlap_record in records_that_overlap:
                stroverlap.append(
                    ' -> '.join([str(overlap_record.date_start), str(overlap_record.date_end)]))

            return ' '.join(stroverlap)

        def custom_post(serializer):

            if not pk_already_exists(serializer):
                # can insert because it's not the same record
                # 1) verify the record is not between any two existing records
                records_that_overlap = utils.StationInfoUtils.get_records_that_overlap(
                    serializer, self.get_queryset)

                if len(records_that_overlap) > 0:
                    # if it overlaps all records and the date_start < first_record.date_start
                    # see if we have to extend the initial date

                    if len(records_that_overlap) == utils.StationInfoUtils.get_same_station_records(serializer, self.get_queryset).count() and \
                            serializer.validated_data['date_start'] < utils.StationInfoUtils.get_same_station_records(serializer, self.get_queryset).first().date_start:
                        if records_are_equal(serializer, utils.StationInfoUtils.get_same_station_records(serializer, self.get_queryset).first()):

                            previous_date = utils.StationInfoUtils.get_same_station_records(
                                serializer, self.get_queryset).first().date_start

                            modify_record_start_date(
                                serializer, utils.StationInfoUtils.get_same_station_records(serializer, self.get_queryset).first())

                            insert_update_event(serializer, previous_date)

                            return previous_date  # in order to change the response message
                        else:

                            modify_date_end(
                                serializer, utils.StationInfoUtils.get_same_station_records(serializer, self.get_queryset).first())

                            created_object = serializer.save()

                            insert_create_event(serializer,
                                                created_object)

                    elif len(records_that_overlap) == 1 and records_that_overlap[0] == utils.StationInfoUtils.get_same_station_records(serializer, self.get_queryset).last() and \
                            utils.StationInfoUtils.get_same_station_records(serializer, self.get_queryset).last().date_end == None:
                        # overlap with the last session
                        # stop the current valid session
                        last_record = utils.StationInfoUtils.get_same_station_records(
                            serializer, self.get_queryset).last()

                        modify_last_record_end_date(serializer, last_record)

                        # create the incoming session
                        serializer.save()

                        insert_create_event_with_extra_description(
                            serializer, last_record)

                    else:
                        raise exceptions.CustomValidationErrorExceptionHandler(
                            f"Record ${serializer.validated_data['date_start']} -> ${serializer.validated_data['date_end'] if 'date_end' in serializer.validated_data else None} overlaps with existing station.info records: ${get_overlap_exception_detail(records_that_overlap)}")
                else:
                    # no overlaps, insert the record
                    created_object = serializer.save()

                    insert_create_event(serializer, created_object)
            else:
                raise exceptions.CustomValidationErrorExceptionHandler(
                    'The record already exists in the database.')

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = custom_post(serializer)

        if result == None:

            headers = self.get_success_headers(serializer.data)

            created_record_serializer = serializers.StationinfoSerializer(self.get_queryset().get(
                network_code=serializer.validated_data['network_code'], station_code=serializer.validated_data['station_code'], date_start=serializer.validated_data['date_start']))

            return Response(created_record_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            # no new record was created, only the start date of the first record was modified
            previous_date = result

            headers = self.get_success_headers(serializer.data)

            return Response('The start date of the station information record ' +
                            previous_date.strftime("%Y-%m-%d %H:%M:%S") +
                            ' has been been modified to ' +
                            serializer.validated_data['date_start'].strftime("%Y-%m-%d %H:%M:%S"), status=status.HTTP_201_CREATED, headers=headers)


class StationinfoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Stationinfo.objects.all()
    serializer_class = serializers.StationinfoSerializer

    def put(self, request, *args, **kwargs):

        def overlaps_at_least_one_record(serializer):

            records_that_overlap = utils.StationInfoUtils.get_records_that_overlap(
                serializer, self.get_queryset, self.get_object)

            # it can overlap itself, so we need to check if it overlaps at least one other record
            for record in records_that_overlap:
                if record.api_id != self.get_object().api_id:
                    return True

            return False

        def insert_event(serializer, record_before_update: dict):

            EventManager.create_event(description=serializer.validated_data["date_start"].strftime("%Y-%m-%d %H:%M:%S") +
                                      ' has been updated:\n' + utils.StationInfoUtils.record_to_str(self.get_object()) +
                                      '\n+++++++++++++++++++++++++++++++++++++\n' +
                                      'Previous record:\n' +
                                      str(record_before_update) + '\n',
                                      station_code=record_before_update["station_code"],
                                      network_code=record_before_update["network_code"])

        def custom_update(serializer):
            if overlaps_at_least_one_record(serializer):
                raise exceptions.CustomValidationErrorExceptionHandler(
                    'The record overlaps with at least one existing record.')
            else:
                record_before_update = utils.StationInfoUtils.get_record_values(
                    self.get_object)

                self.perform_update(serializer)

                insert_event(serializer, record_before_update)

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # they should not be updated
        del serializer.validated_data['network_code']
        del serializer.validated_data['station_code']

        custom_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        """
            Adds an event when the object is succesfully deleted
        """
        record_before_delete = utils.StationInfoUtils.get_record_values(
            self.get_object)

        self.perform_destroy(self.get_object())

        EventManager.create_event(description='The station information record ' +
                                  record_before_delete["date_start"].strftime("%Y-%m-%d %H:%M:%S") +
                                  ' has been deleted.',
                                  station_code=record_before_delete["station_code"],
                                  network_code=record_before_delete["network_code"])

        return Response(status=status.HTTP_204_NO_CONTENT)